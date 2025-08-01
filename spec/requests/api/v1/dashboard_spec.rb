require "rails_helper"
require "support/auth_helpers"

RSpec.describe "Api::V1::Dashboard", type: :request do
  include AuthHelpers

  let(:librarian) { User.create!(email: "lib@example.com", password: "password", role: :librarian) }
  let(:member)    { User.create!(email: "member@example.com", password: "password", role: :member) }
  let(:member2)    { User.create!(email: "member2@example.com", password: "password", role: :member) }

  let!(:book1) { Book.create!(title: "Book A", author: "Author A", genre: "Fantasy", isbn: "A1", total_copies: 3, available_copies: 3) }
  let!(:book2) { Book.create!(title: "Book B", author: "Author B", genre: "Sci-Fi", isbn: "B2", total_copies: 3, available_copies: 3) }

  before do
    travel_to 3.days.ago do
      Borrowing.create!(user: member, book: book1)
    end
    travel_to 10.days.ago do
      Borrowing.create!(user: member, book: book2)
    end
    travel_to 2.weeks.ago do
      Borrowing.create!(user: member2, book: book1)
    end
    travel_to 3.weeks.ago do
      Borrowing.create!(user: member2, book: book2)
    end
  end

  describe "GET /api/v1/dashboard" do
    context "as librarian" do
      it "returns dashboard data for librarian" do
        get "/api/v1/dashboard", headers: login_headers(librarian)

        json = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json["total_books"]).to eq(2)
        expect(json["borrowed_books"]).to eq(4)
        expect(json["due_today"]).to eq(1)
        expect(json["overdue_members"]).to eq([ member2.email ])
      end
    end

    context "as member" do
      it "returns dashboard data for member" do
        get "/api/v1/dashboard", headers: login_headers(member2)

        json = JSON.parse(response.body)

        expect(response).to have_http_status(:ok)
        expect(json["borrowed_count"]).to eq(2)
        expect(json["overdue_count"]).to eq(1)
        expect(json["borrowed_books"]).to be_an(Array)
        expect(json["borrowed_books"].pluck('title')).to match_array([ book1.title, book2.title ])
      end
    end
  end
end
