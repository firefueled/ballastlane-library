import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchWithCsrf } from "../../api";

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
    return <p className="has-text-danger has-text-centered mt-5">Restricted to librarians only.</p>;
  }

  return (
    <section className="section">
      <div className="container">
        <h2 className="title is-4 has-text-centered mb-5">Borrowing Management</h2>

        <div className="table-container">
          <table className="table is-fullwidth is-striped is-hoverable is-bordered">
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
                        <span className="tag is-success">Returned</span>
                      ) : isOverdue ? (
                        <span className="tag is-danger">Overdue</span>
                      ) : (
                        <span className="tag is-warning">Borrowed</span>
                      )}
                    </td>
                    <td>
                      {!b.returned_at && (
                        <button
                          className="button is-small is-link is-light"
                          onClick={() => markReturned(b.id)}
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
