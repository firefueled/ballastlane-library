require "rails_helper"

RSpec.describe Borrowing, type: :model do
  let(:user) { User.create!(email: "member@example.com", password: "password", role: :member) }
  let(:book) { Book.create!(title: "Test", author: "Author", genre: "Genre", isbn: "X1", total_copies: 2, available_copies: 2) }

  subject do
    described_class.new(
      user: user,
      book: book,
    )
  end

  describe "validations" do
    it "is valid with required attributes" do
      expect(subject).to be_valid
    end

    it "is valid without returned_at" do
      subject.returned_at = nil
      expect(subject).to be_valid
    end

    it "is invalid without a user" do
      subject.user = nil
      expect(subject).not_to be_valid
    end

    it "is invalid without a book" do
      subject.book = nil
      expect(subject).not_to be_valid
    end

    it "allows borrowing when copies are available" do
      expect(subject).to be_valid
    end

    it "prevents borrowing if book is not available" do
      book.update!(available_copies: 0)
      expect(subject).not_to be_valid
      expect(subject.errors[:book]).to include("is not available")
    end

    it "prevents duplicate active borrowing by same user" do
      subject.save
      duplicate = subject.dup
      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:base]).to include("You already borrowed this book.")
    end

    it "allows re-borrowing after return" do
      subject.save
      subject.update!(returned_at: Time.current)
      expect {
        Borrowing.create!(user: user, book: book)
      }.not_to raise_error
    end
  end

  describe "callbacks" do
    it "sets borrowed_at to now and due_at two weeks from now" do
      travel_to Time.zone.local(2025, 8, 1, 10, 0, 0) do
        b = Borrowing.create!(user: user, book: book)
        expect(b.borrowed_at).to eq Time.zone.local(2025, 8, 1, 10, 0, 0)
        expect(b.due_at).to eq 2.weeks.from_now
      end
    end

    it "decrements the book's available_copies on create" do
      expect { subject.save }
        .to change { book.reload.available_copies }.by(-1)
    end

    it "increments the book's available_copies when returned_at is set" do
      subject.save
      expect {
        subject.update!(returned_at: Time.current)
      }.to change { book.reload.available_copies }.by(1)
    end
  end
end
