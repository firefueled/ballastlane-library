import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BookList from "./pages/BookList";
import { AuthProvider } from "./AuthContext";
import RequireAuth from "./RequireAuth";
import BookForm from "./pages/BookForm";
import BorrowingsList from "./pages/BorrowingsList";
import BorrowingsAdmin from "./pages/BorrowingsAdmin";
import Register from "./pages/Register";
import Navbar from "./Navbar";
import HomeRedirect from "./HomeRedirect";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/new" element={<BookForm />} />
            <Route path="/books/:id/edit" element={<BookForm />} />
            <Route path="/my-borrowings" element={<BorrowingsList />} />
            <Route path="/admin/borrowings" element={<BorrowingsAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
