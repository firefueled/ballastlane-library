# User Story for Library app

As a user of the Library App, I want to be able to register, log in, and log out, so I can manage or borrow books based on my role.

## Librarian

As a librarian, I want to:

- Add, edit, and delete books in the system, including their title, author, genre, ISBN, and number of copies.
- Search for books by title, author, or genre.
- See a dashboard that gives me a quick overview of the library: how many books are in the system, how many are currently borrowed, which ones are due today, and which members have overdue books.
- View and manage all borrowings, including marking books as returned when members bring them back.

## Member

As a member, I want to:

- Browse and search the book collection by title, author, or genre.
- Borrow a book if it’s available (and not borrow the same book twice).
- See a personal dashboard that shows me what books I’ve borrowed, when they’re due, and whether any are overdue.

## API & Development Notes

As a developer, I want:

- A RESTful API with proper HTTP status codes that allows:
  - Managing users and sessions (register, login, logout).
  - Full CRUD for books.
  - Borrow and return actions for members and librarians.
- Tests written in RSpec to cover all critical features and edge cases, including authorization logic, search, and borrowing rules.