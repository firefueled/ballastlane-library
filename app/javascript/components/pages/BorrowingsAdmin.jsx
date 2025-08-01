// app/javascript/components/pages/BorrowingsAdmin.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import {fetchWithCsrf} from "../../api";

export default function BorrowingsAdmin() {
  const { user } = useAuth();
  const [borrowings, setBorrowings] = useState([]);

  const fetchBorrowings = () => {
    fetchWithCsrf("/api/v1/borrowings")
      .then((res) => res.json())
      .then(setBorrowings);
  };

  useEffect(() => {
    if (user?.role === "librarian") fetchBorrowings();
  }, [user]);

  const markReturned = async (id) => {
    const res = await fetchWithCsrf(`/api/v1/borrowings/${id}/return`, {
      method: "PATCH",
    });
    if (res.ok) fetchBorrowings();
  };

  const today = new Date();

  if (user?.role !== "librarian") {
    return <p>Restricted to librarians only.</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>Borrowing Management</h2>
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Book</th>
            <th>Member</th>
            <th>Borrowed At</th>
            <th>Due At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {borrowings.map((b) => {
            const due = new Date(b.due_at);
            const isOverdue = !b.returned_at && today > due;

            return (
              <tr key={b.id}>
                <td>{b.book.title}</td>
                <td>{b.user.email}</td>
                <td>{new Date(b.borrowed_at).toLocaleDateString()}</td>
                <td>{due.toLocaleDateString()}</td>
                <td>
                  {b.returned_at ? (
                    <span style={{ color: "green" }}>Returned</span>
                  ) : isOverdue ? (
                    <span style={{ color: "red" }}>Overdue</span>
                  ) : (
                    "Borrowed"
                  )}
                </td>
                <td>
                  {!b.returned_at && (
                    <button onClick={() => markReturned(b.id)}>Mark Returned</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
