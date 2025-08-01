import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {fetchWithCsrf} from "../../api";

function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta && meta.content;
}

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
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Books</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={q}
          placeholder="Search by title, author, or genre"
          onChange={(e) => setQ(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit">Search</button>
      </form>

      {user?.role === "librarian" && <Link to="/books/new">+ New Book</Link>}

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> — {book.author} ({book.genre})
            {user?.role === "member" && book.available_copies > 0 && (
              <button onClick={() => borrowBook(book.id)}>Borrow</button>
            )}
            {user?.role === "librarian" && (
              <>
                {" "}
                <Link to={`/books/${book.id}/edit`}>Edit</Link>
                {" "}
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
