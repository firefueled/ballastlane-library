import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { fetchWithCsrf } from "../../api";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchWithCsrf("/api/v1/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!user || !data) return <p className="has-text-centered mt-6">Loading...</p>;

  return (
    <section className="section">
      <div className="container">
        <div className="level mb-5">
          <div className="level-left">
            <h1 className="title is-3">Dashboard</h1>
          </div>
        </div>

        {user.role === "librarian" ? (
          <LibrarianDashboard data={data} />
        ) : (
          <MemberDashboard data={data} />
        )}

        <div className="mt-5">
          {user?.role === "member" && (
            <Link to="/my-borrowings" className="button is-link is-light mr-3">
              My Borrowings
            </Link>
          )}
          {user?.role === "librarian" && (
            <Link to="/admin/borrowings" className="button is-link is-light">
              Manage Borrowings
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function LibrarianDashboard({ data }) {
  return (
    <>
      <div className="columns is-multiline">
        <StatCard title="Total Books" value={data.total_books} color="is-info" />
        <StatCard title="Borrowed Books" value={data.borrowed_books} color="is-warning" />
        <StatCard title="Due Today" value={data.due_today} color="is-danger" />
      </div>

      <div className="box mt-5">
        <h2 className="subtitle is-5 mb-3">Members with Overdue Books</h2>
        {data.overdue_members.length === 0 ? (
          <p className="has-text-grey">No overdue members.</p>
        ) : (
          <ul>
            {data.overdue_members.map((email) => (
              <li key={email} className="mb-1">
                <span className="icon has-text-danger">
                  <i className="fas fa-exclamation-triangle"></i>
                </span>{" "}
                {email}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function MemberDashboard({ data }) {
  return (
    <>
      <div className="columns is-multiline">
        <StatCard title="Currently Borrowed" value={data.borrowed_count} color="is-info" />
        <StatCard title="Overdue Books" value={data.overdue_count} color="is-danger" />
      </div>

      <div className="box mt-5">
        <h2 className="subtitle is-5 mb-3">Your Borrowed Books</h2>
        {data.borrowed_books.length === 0 ? (
          <p className="has-text-grey">You have not borrowed any books yet.</p>
        ) : (
          <ul>
            {data.borrowed_books.map((book) => (
              <li key={book.id} className="mb-2">
                <strong>{book.title}</strong> by {book.author} — Due on:{" "}
                {new Date(book.due_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="column is-4">
      <div className={`card ${color}`}>
        <div className="card-content">
          <p className="title is-4">{value}</p>
          <p className="subtitle is-6">{title}</p>
        </div>
      </div>
    </div>
  );
}
