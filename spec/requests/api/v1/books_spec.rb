# spec/requests/api/v1/books_spec.rb
require "rails_helper"
require "support/auth_helpers"

RSpec.describe "Books API", type: :request do
  include AuthHelpers

  let(:librarian) { User.create!(email: "librarian@example.com", password: "password", role: :librarian) }
  let(:member)    { User.create!(email: "member@example.com", password: "password", role: :member) }

  let!(:book1) { Book.create!(title: "Title One", author: "Author A", genre: "Fantasy", isbn: "ISBN1", total_copies: 2, available_copies: 2) }
  let!(:book2) { Book.create!(title: "Title Two", author: "Author B", genre: "Sci-Fi", isbn: "ISBN2", total_copies: 3, available_copies: 1) }

  describe "GET /api/v1/books" do
    it "returns all books for member" do
      headers = login_headers(member)
      get "/api/v1/books", headers: headers
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(2)
    end

    it "allows search by title" do
      headers = login_headers(member)
      get "/api/v1/books?q=Title One", headers: headers
      titles = JSON.parse(response.body).map { |b| b["title"] }
      expect(titles).to include("Title One")
      expect(titles).not_to include("Title Two")
    end

    it "allows search by title, author, and genre at the same time" do
      Book.create!(title: "Great Book One", author: "Author Title", genre: "Romance", isbn: "ISBN3", total_copies: 3, available_copies: 1)
      Book.create!(title: "Great Book Two", author: "Author C", genre: "Genre Title", isbn: "ISBN4", total_copies: 3, available_copies: 1)

      headers = login_headers(member)
      get "/api/v1/books?q=Title", headers: headers

      titles = JSON.parse(response.body).map { |b| b["title"] }
      expect(titles).to include("Title One", "Title Two", "Great Book One", "Great Book Two")
    end
  end

  describe "POST /api/v1/books" do
    let(:valid_params) do
      {
        book: {
          title: "New Book",
          author: "New Author",
          genre: "Drama",
          isbn: "NEWISBN",
          total_copies: 5,
          available_copies: 5
        }
      }
    end

    it "creates a book if librarian" do
      headers = login_headers(librarian)
      post "/api/v1/books", params: valid_params, headers: headers
      expect(response).to have_http_status(:created)
      expect(Book.last.title).to eq("New Book")
    end

    it "forbids creation if member" do
      headers = login_headers(member)
      post "/api/v1/books", params: valid_params, headers: headers
      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "PUT /api/v1/books/:id" do
    it "updates book if librarian" do
      headers = login_headers(librarian)
      put "/api/v1/books/#{book1.id}", params: { book: { title: "Updated" } }, headers: headers
      expect(response).to have_http_status(:ok)
      expect(book1.reload.title).to eq("Updated")
    end

    it "forbids update if member" do
      headers = login_headers(member)
      put "/api/v1/books/#{book1.id}", params: { book: { title: "X" } }, headers: headers
      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "DELETE /api/v1/books/:id" do
    it "deletes book if librarian" do
      headers = login_headers(librarian)
      expect {
        delete "/api/v1/books/#{book2.id}", headers: headers
      }.to change(Book, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it "forbids deletion if member" do
      headers = login_headers(member)
      delete "/api/v1/books/#{book1.id}", headers: headers
      expect(response).to have_http_status(:forbidden)
    end
  end
end
