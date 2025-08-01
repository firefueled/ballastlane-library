import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";

export default function BorrowingsList() {
  const { user } = useAuth();
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    fetch("/api/v1/borrowings")
      .then((res) => res.json())
      .then(setBorrowings);
  }, []);

  const today = new Date();

  return (
    <section className="section">
      <div className="container">
        <h2 className="title is-4 has-text-centered">My Borrowed Books</h2>

        {borrowings.length === 0 ? (
          <p className="has-text-grey has-text-centered mt-5">
            You haven't borrowed any books yet.
          </p>
        ) : (
          <div className="columns is-multiline">
            {borrowings.map((b) => {
              const due = new Date(b.due_at);
              const isOverdue = !b.returned_at && today > due;

              const status = b.returned_at
                ? { label: "Returned", color: "is-success" }
                : isOverdue
                ? { label: "Overdue", color: "is-danger" }
                : { label: "Borrowed", color: "is-warning" };

              return (
                <div className="column is-12" key={b.id}>
                  <div className="card">
                    <header className="card-header">
                      <p className="card-header-title">
                        {b.book.title}
                      </p>
                      <span className={`tag m-2 ${status.color}`}>
                        {status.label}
                      </span>
                    </header>
                    <div className="card-content">
                      <div className="content">
                        <p>
                          <strong>Due on:</strong> {due.toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Author:</strong> {b.book.author}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
