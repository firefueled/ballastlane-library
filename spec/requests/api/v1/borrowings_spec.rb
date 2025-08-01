require 'rails_helper'
require "support/auth_helpers"

RSpec.describe "Api::V1::Borrowings", type: :request do
  include AuthHelpers

  let(:librarian) { User.create!(email: "lib@example.com", password: "password", role: :librarian) }
  let(:member) { User.create!(email: "mem@example.com", password: "password", role: :member) }

  let!(:book) { Book.create!(title: "Test", author: "Author", genre: "Genre", isbn: "123", total_copies: 2, available_copies: 2) }

  describe "GET /index" do
    it "returns all borrowings for librarian" do
      Borrowing.create!(user: member, book: book)
      Borrowing.create!(user: librarian, book: book)

      headers = login_headers(librarian)
      get "/api/v1/borrowings", headers: headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).length).to eq(2)
    end

    it "returns only the member's borrowings" do
      Borrowing.create!(user: member, book: book)
      Borrowing.create!(user: librarian, book: book)

      headers = login_headers(member)
      get "/api/v1/borrowings", headers: headers

      json = JSON.parse(response.body)
      expect(response).to have_http_status(:ok)
      expect(json.length).to eq(1)
      expect(json.first["user_id"]).to eq(member.id)
    end
  end

  describe "POST /create" do
    it "allows a member to borrow a book" do
      headers = login_headers(member)
      post "/api/v1/borrowings", params: { book_id: book.id }, headers: headers

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["book_id"]).to eq(book.id)
    end

    it "does not allow borrowing if book is unavailable" do
      book.update!(available_copies: 0)

      headers = login_headers(member)
      post "/api/v1/borrowings", params: { book_id: book.id }, headers: headers

      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"]).to include("Book is not available")
    end
  end

  describe "PATCH /return" do
    let(:borrowing) { Borrowing.create!(user: member, book: book) }

    it "allows a librarian to mark a book as returned" do
      headers = login_headers(librarian)
      patch "/api/v1/borrowings/#{borrowing.id}/return", headers: headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["returned_at"]).not_to be_nil
    end

    it "forbids a member from returning a book" do
      headers = login_headers(member)
      patch "/api/v1/borrowings/#{borrowing.id}/return", headers: headers

      expect(response).to have_http_status(:forbidden)
    end
  end
end
