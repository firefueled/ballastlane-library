# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Users
User.create!(email: "librarian@example.com", password: "password", role: :librarian)
User.create!(email: "member1@example.com", password: "password", role: :member)
User.create!(email: "member2@example.com", password: "password", role: :member)

# Books
Book.create!(title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", isbn: "12345", total_copies: 3, available_copies: 3)
Book.create!(title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", isbn: "67890", total_copies: 2, available_copies: 2)
Book.create!(title: "Clean Code", author: "Robert C. Martin", genre: "Programming", isbn: "111213", total_copies: 5, available_copies: 5)
