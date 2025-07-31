import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
