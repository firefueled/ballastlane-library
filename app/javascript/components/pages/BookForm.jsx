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
    return <p className="has-text-danger has-text-centered">Access restricted to librarians.</p>;
  }

  return (
    <div className="container">
      <div className="columns is-centered mt-5">
        <div className="column is-half">
          <h2 className="title is-4 has-text-centered">{isEdit ? "Edit Book" : "New Book"}</h2>
          <form onSubmit={handleSubmit} className="box">
            <div className="field">
              <label className="label">Title</label>
              <div className="control">
                <input className="input" name="title" value={book.title} onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label className="label">Author</label>
              <div className="control">
                <input className="input" name="author" value={book.author} onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label className="label">Genre</label>
              <div className="control">
                <input className="input" name="genre" value={book.genre} onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label className="label">ISBN</label>
              <div className="control">
                <input className="input" name="isbn" value={book.isbn} onChange={handleChange} required />
              </div>
            </div>

            <div className="field">
              <label className="label">Total Copies</label>
              <div className="control">
                <input className="input" type="number" name="total_copies" min="1" value={book.total_copies} onChange={handleChange} required />
              </div>
            </div>

            <div className="field is-grouped is-justify-content-center mt-4">
              <div className="control">
                <button type="submit" className="button is-link">
                  {isEdit ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
