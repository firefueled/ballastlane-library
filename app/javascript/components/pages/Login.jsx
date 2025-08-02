import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithCsrf } from "../../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithCsrf("/api/v1/users/sign_in", {
      method: "POST",
      body: JSON.stringify({ user: { email, password } }),
    });

    if (response.ok) {
      setError(null);
      window.location.href = "/dashboard";
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <section className="section is-flex is-justify-content-center is-align-items-center">
      <div className="box" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="title is-4 has-text-centered">Sign In</h1>

        {error && (
          <div className="notification is-danger is-light">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="field mt-4">
            <div className="control">
              <button className="button is-link is-fullwidth" type="submit">
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
