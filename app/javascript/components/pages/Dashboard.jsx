import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext";
import {fetchWithCsrf} from "../../api";

function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta && meta.content;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchWithCsrf("/api/v1/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);
  const handleLogout = async () => {
    const response = await fetch("/users/sign_out", {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": getCsrfToken(),
      },
      credentials: "include",
    });

    if (response.ok) {
      navigate("/login");
    } else {
      alert("Erro ao sair. Tente novamente.");
    }
  };

  if (!user || !data) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Dashboard</h2>
      {user.role === "librarian" ? (
        <LibrarianDashboard data={data} />
      ) : (
        <MemberDashboard data={data} />
      )}

      {user?.role === "member" && <Link to="/my-borrowings">My Borrowings</Link>}
      {user?.role === "librarian" && (<Link to="/admin/borrowings">Manage Borrowings</Link>)}

      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

function LibrarianDashboard({ data }) {
  return (
    <>
      <p><strong>Total Books:</strong> {data.total_books}</p>
      <p><strong>Borrowed Books:</strong> {data.borrowed_books}</p>
      <p><strong>Due Today:</strong> {data.due_today}</p>
      <p><strong>Members with Overdue:</strong></p>
      <ul>
        {data.overdue_members.map((email) => (
          <li key={email}>{email}</li>
        ))}
      </ul>
    </>
  );
}

function MemberDashboard({ data }) {
  return (
    <>
      <p><strong>Currently Borrowed:</strong> {data.borrowed_count}</p>
      <p><strong>Overdue:</strong> {data.overdue_count}</p>
      <p><strong>Borrowed Books:</strong></p>
      <ul>
        {data.borrowed_books.map((book) => (
          <li key={book.id}>
              <strong>{book.title}</strong> by {book.author} — Due on: {new Date(book.due_at).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </>
  );
}
