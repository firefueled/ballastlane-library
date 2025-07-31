import React from "react";
import { useNavigate } from "react-router-dom";

function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta && meta.content;
}

export default function Dashboard() {
  const navigate = useNavigate();

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
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
