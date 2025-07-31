import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext";

function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta && meta.content;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Você está logado.</p>

      {user?.role === "member" && <Link to="/my-borrowings">My Borrowings</Link>}
      {user?.role === "librarian" && (<Link to="/admin/borrowings">Manage Borrowings</Link>)}

      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
