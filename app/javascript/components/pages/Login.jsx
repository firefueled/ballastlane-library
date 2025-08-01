import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {fetchWithCsrf} from "../../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithCsrf("/users/sign_in", {
      method: "POST",
      body: JSON.stringify({ user: { email, password } }),
    });

    if (response.ok) {
      setError(null);
      navigate("/dashboard");
    } else {
      setError("Email ou senha inválidos.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        </div>
        <div>
          <label>Senha:</label><br />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
