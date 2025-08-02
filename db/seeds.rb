require 'faker'

# Clear old data
User.destroy_all
Book.destroy_all
Borrowing.destroy_all

puts "Creating users..."

# Librarians
librarians = 2.times.map do |i|
  User.create!(
    email: "librarian#{i + 1}@library.com",
    password: "password",
    role: "librarian"
  )
end

# Members
members = 10.times.map do |i|
  User.create!(
    email: "member#{i + 1}@library.com",
    password: "password",
    role: "member"
  )
end

puts "Created #{User.count} users"

puts "Creating books and borrowings..."

10.times do |i|
  book = Book.create!(
    title: Faker::Book.title,
    author: Faker::Book.author,
    genre: Faker::Book.genre,
    isbn: Faker::Code.isbn,
    total_copies: 50
  )

  member_pool = members.shuffle

  # 5 overdue (not returned)
  member_pool.shift(5).each do |member|
    Borrowing.create!(
      book: book,
      user: member,
      borrowed_at: 3.weeks.ago,
    )
  end

  # 20 returned
  member_pool.shuffle.take(20).each do |member|
    borrowed_at = Faker::Date.between(from: 2.months.ago, to: 1.month.ago)
    returned_at = due_at - rand(1..5).days

    Borrowing.create!(
      book: book,
      user: member,
      borrowed_at: borrowed_at,
      returned_at: returned_at
    )
  end

  # 5 active but not overdue
  member_pool.shuffle.take(5).each do |member|
    borrowed_at = 3.days.ago

    Borrowing.create!(
      book: book,
      user: member,
      borrowed_at: borrowed_at,
      returned_at: nil
    )
  end
end

puts "Done. Created #{Book.count} books and #{Borrowing.count} borrowings."
