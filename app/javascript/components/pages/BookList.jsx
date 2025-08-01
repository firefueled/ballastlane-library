import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {fetchWithCsrf} from "../../api";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState("");
  const { user } = useAuth();

  const fetchBooks = async () => {
    const res = await fetchWithCsrf(`/api/v1/books?q=${encodeURIComponent(q)}`);
    if (res.ok) {
      const data = await res.json();
      setBooks(data);
    }
  };

  const borrowBook = async (bookId) => {
    const res = await fetchWithCsrf("/api/v1/borrowings", {
      method: "POST",
      body: JSON.stringify({ book_id: bookId }),
    });

    if (res.ok) {
      alert("Book borrowed successfully.");
      fetchBooks();
    } else {
      const data = await res.json();
      alert("Error: " + data.errors?.join(", "));
    }
  };


  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    const res = await fetchWithCsrf(`/api/v1/books/${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchBooks();
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="title is-4">Books</h2>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input"
                type="text"
                value={q}
                placeholder="Search by title, author, or genre"
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="control">
              <button type="submit" className="button is-link">
                Search
              </button>
            </div>
          </div>
        </form>

        {user?.role === "librarian" && (
          <div className="mb-4">
            <Link to="/books/new" className="button is-primary is-small">
              + New Book
            </Link>
          </div>
        )}

        <div className="box">
          <ul>
            {books.map((book) => (
              <li key={book.id} className="mb-4">
                <div className="content">
                  <p>
                    <strong>{book.title}</strong> — {book.author} ({book.genre})
                  </p>
                  <div className="buttons mt-2">
                    {user?.role === "member" && book.available_copies > 0 && (
                      <button
                        onClick={() => borrowBook(book.id)}
                        className="button is-success is-small"
                      >
                        Borrow
                      </button>
                    )}
                    {user?.role === "librarian" && (
                      <>
                        <Link
                          to={`/books/${book.id}/edit`}
                          className="button is-info is-small"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="button is-danger is-small"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
