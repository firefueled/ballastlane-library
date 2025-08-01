# spec/models/book_spec.rb
require "rails_helper"

RSpec.describe Book, type: :model do
  subject do
    described_class.new(
      title: "Test Book",
      author: "Jane Doe",
      genre: "Fiction",
      isbn: "123-4567890123",
      total_copies: 5
    )
  end

  describe "validations" do
    it "is valid with required attributes" do
      expect(subject).to be_valid
    end

    it "is invalid without a title" do
      subject.title = nil
      expect(subject).not_to be_valid
    end

    it "is invalid without an author" do
      subject.author = nil
      expect(subject).not_to be_valid
    end

    it "is invalid without a genre" do
      subject.genre = nil
      expect(subject).not_to be_valid
    end

    it "is invalid without an isbn" do
      subject.isbn = nil
      expect(subject).not_to be_valid
    end

    it "is invalid without total_copies" do
      subject.total_copies = nil
      expect(subject).not_to be_valid
    end

    it "is invalid if total_copies is negative" do
      subject.total_copies = -3
      expect(subject).not_to be_valid
    end

    it "is invalid if available_copies is negative" do
      subject.available_copies = -1
      expect(subject).not_to be_valid
    end

    it "requires unique ISBNs" do
      subject.save!
      duplicate = subject.dup
      expect(duplicate).not_to be_valid
    end
  end

  describe "callbacks" do
    it "sets available_copies to total_copies by default" do
      book = described_class.create!(
        title: "Book A",
        author: "Author",
        genre: "Fantasy",
        isbn: "999-9999999999",
        total_copies: 4
      )
      expect(book.available_copies).to eq(4)
    end

    it "keeps manually set available_copies if present" do
      book = described_class.create!(
        title: "Book B",
        author: "Author",
        genre: "Fantasy",
        isbn: "888-8888888888",
        total_copies: 10,
        available_copies: 3
      )
      expect(book.available_copies).to eq(3)
    end
  end

  describe "#available?" do
    it "returns true when available_copies is greater than 0" do
      book = Book.new(available_copies: 3)
      expect(book.available?).to be true
    end

    it "returns false when available_copies is 0" do
      book = Book.new(available_copies: 0)
      expect(book.available?).to be false
    end

    it "returns false when available_copies is nil" do
      book = Book.new(available_copies: nil)
      expect(book.available?).to be false
    end
  end
end
