import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { fetchWithCsrf } from "../../api";

export default function BookForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    total_copies: 1,
  });

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchWithCsrf(`/api/v1/books/${id}`)
        .then((res) => res.json())
        .then((data) => setBook(data));
    }
  }, [id]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEdit ? "PATCH" : "POST";
    const url = isEdit ? `/api/v1/books/${id}` : "/api/v1/books";

    const res = await fetchWithCsrf(url, {
      method,
      body: JSON.stringify({ book }),
    });

    if (res.ok) {
      navigate("/books");
    } else {
      const data = await res.json();
      alert("Error: " + (data.errors || []).join(", "));
    }
  };

  if (user?.role !== "librarian") {
    return <p>Access restricted to librarians.</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>{isEdit ? "Edit Book" : "New Book"}</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={book.title} onChange={handleChange} placeholder="Title" required /><br />
        <input name="author" value={book.author} onChange={handleChange} placeholder="Author" required /><br />
        <input name="genre" value={book.genre} onChange={handleChange} placeholder="Genre" required /><br />
        <input name="isbn" value={book.isbn} onChange={handleChange} placeholder="ISBN" required /><br />
        <input name="total_copies" type="number" min="1" value={book.total_copies} onChange={handleChange} placeholder="Total Copies" required /><br />
        <button type="submit">{isEdit ? "Save" : "Create"}</button>
      </form>
    </div>
  );
}
