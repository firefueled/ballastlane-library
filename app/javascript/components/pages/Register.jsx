import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithCsrf } from "../../api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    role: "member",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchWithCsrf("/api/v1/users", {
      method: "POST",
      body: JSON.stringify({ user: form }),
    });

    if (response.ok) {
      navigate("/login");
    } else {
      const data = await response.json();
      setError(data.errors?.join(", ") || "Something went wrong.");
    }
  };

  return (
    <div className="container is-max-desktop p-4">
      <h2 className="title is-4">Register</h2>
      {error && <div className="notification is-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input className="input" type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
        </div>

        <div className="field">
          <label className="label">Confirm Password</label>
          <div className="control">
            <input className="input" type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required />
          </div>
        </div>

        <div className="field">
          <label className="label">Role</label>
          <div className="control">
            <div className="select">
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="member">Member</option>
                <option value="librarian">Librarian</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
