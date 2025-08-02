import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return <Navigate to={user ? "/dashboard" : "/login"} />;
}
