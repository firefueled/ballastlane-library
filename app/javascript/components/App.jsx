import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BookList from "./pages/BookList";
import { AuthProvider } from "./AuthContext";
import RequireAuth from "./RequireAuth";
import BookForm from "./pages/BookForm";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/books"
            element={
              <RequireAuth>
                <BookList />
              </RequireAuth>
            }
          />
            <Route
              path="/books/new"
              element={
                <RequireAuth>
                  <BookForm />
                </RequireAuth>
              }
            />
            <Route
              path="/books/:id/edit"
              element={
                <RequireAuth>
                  <BookForm />
                </RequireAuth>
              }
            />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
