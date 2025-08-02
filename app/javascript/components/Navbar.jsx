import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { fetchWithCsrf } from "../api";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await fetchWithCsrf("/api/v1/users/sign_out", { method: "DELETE" });

    if (res.ok) {
      setUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    } else {
      alert("Failed to log out.");
    }
  };

  const renderBorrowingLink = () => {
    if (!user) return null;
    return user.role === "librarian" ? (
      <Link className="navbar-item" to="/admin/borrowings">
        Borrowings
      </Link>
    ) : (
      <Link className="navbar-item" to="/my-borrowings">
        My Borrowings
      </Link>
    );
  };

  return (
    <nav className="navbar is-light" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link className="navbar-item" to="/">
          📚 LibraryApp
        </Link>
      </div>
      <div className="navbar-menu is-active">
        <div className="navbar-start">
          {user && (
            <>
              <Link className="navbar-item" to="/dashboard">
                Dashboard
              </Link>
              <Link className="navbar-item" to="/books">
                Books
              </Link>
              {renderBorrowingLink()}
            </>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            {!user ? (
              <div className="buttons">
                <Link className="button is-primary" to="/register">
                  <strong>Sign up</strong>
                </Link>
                <Link className="button is-light" to="/login">
                  Log in
                </Link>
              </div>
            ) : (
              <button className="button is-danger" onClick={handleLogout}>
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
