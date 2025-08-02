import React, { createContext, useState, useEffect, useContext } from "react";
import {fetchWithCsrf} from "../api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(user === null);

  useEffect(() => {
    if (!user) {
      fetchWithCsrf("/api/v1/users/current")
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Not authenticated");
        })
        .then((data) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem("user");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
