// app/javascript/components/pages/BorrowingsList.jsx
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
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>My Borrowed Books</h2>
      {borrowings.length === 0 ? (
        <p>You haven't borrowed any books yet.</p>
      ) : (
        <ul>
          {borrowings.map((b) => {
            const due = new Date(b.due_at);
            const isOverdue = !b.returned_at && today > due;

            return (
              <li key={b.id}>
                <strong>{b.book.title}</strong> — Due on{" "}
                {due.toLocaleDateString()}
                {b.returned_at ? (
                  <span style={{ color: "green" }}> (Returned)</span>
                ) : isOverdue ? (
                  <span style={{ color: "red" }}> (Overdue)</span>
                ) : (
                  ""
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
