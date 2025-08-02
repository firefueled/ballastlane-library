# Ballastlane Library

This is a library management system built with Ruby on Rails 8 and React 19.
It follows standards for Ruby on Rails application so it should be straight-forward to get running.

The repository lives at https://github.com/firefueled/ballastlane-library
Clone then install dependencies with:
```bash
bundle install
yarn install
```

There's a seed file with plenty of data to inspect.
Set up the database with:

```bash
rails db:create db:migrate db:seed
```

Start the application with:
```bash
bin/dev
```

Access the application at [http://localhost:3000](http://localhost:3000)

## Architecture

- Backend: Ruby on Rails 8 API with Devise for authentication
- Frontend: React 19 as an SPA with Bulma for styling
- Database: PostgreSQL

## Features

### Authentication

- Registration, login and logout
- Authentication is handled via session cookies, locally stored
- Two user roles:
  - **Librarian**: can manage books and borrowings
  - **Member**: can view and borrow books

### Books

- CRUD for books (only librarians)
- Search by title, author or genre

### Borrowings

- Members can borrow available books
- Borrowing duration is 2 weeks
- Librarians can mark books as returned

### Dashboard

- Librarians see:
  - Total books
  - Borrowed books
  - Books due today
  - Members with overdue books
- Members see:
  - Their borrowed books
  - Due dates and overdue items

## Running the tests

```bash
bundle exec rspec
```

## API

All endpoints are under `/api/v1`.

- `POST /api/v1/users`: Register
- `POST /api/v1/users/sign_in`: Login
- `DELETE /api/v1/users/sign_out`: Logout
- `GET /api/v1/users/current`: Get current user
- `GET /api/v1/books`: List books
- `POST /api/v1/books`: Create book (librarian)
- `PATCH /api/v1/books/:id`: Update book
- `DELETE /api/v1/books/:id`: Delete book
- `POST /api/v1/borrowings`: Borrow a book
- `PATCH /api/v1/borrowings/:id/return`: Return a book
- `GET /api/v1/dashboard`: Dashboard data

