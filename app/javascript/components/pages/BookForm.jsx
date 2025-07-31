import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";

function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta && meta.content;
}

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
      fetch(`/api/v1/books/${id}`, { credentials: "include" })
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

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": getCsrfToken(),
      },
      body: JSON.stringify({ book }),
    });

    if (res.ok) {
      navigate("/books");
    } else {
      const data = await res.json();
      alert("Erro: " + (data.errors || []).join(", "));
    }
  };

  if (user?.role !== "librarian") {
    return <p>Acesso restrito a bibliotecários.</p>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>{isEdit ? "Editar Livro" : "Novo Livro"}</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={book.title} onChange={handleChange} placeholder="Título" required /><br />
        <input name="author" value={book.author} onChange={handleChange} placeholder="Autor" required /><br />
        <input name="genre" value={book.genre} onChange={handleChange} placeholder="Gênero" required /><br />
        <input name="isbn" value={book.isbn} onChange={handleChange} placeholder="ISBN" required /><br />
        <input name="total_copies" type="number" min="1" value={book.total_copies} onChange={handleChange} placeholder="Total de Cópias" required /><br />
        <button type="submit">{isEdit ? "Salvar" : "Criar"}</button>
      </form>
    </div>
  );
}
