import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "token";
const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function isExpired(payload) {
  if (!payload?.exp) return false;
  return Date.now() >= payload.exp * 1000;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem(STORAGE_KEY);
    if (t) {
      const p = decodeToken(t);
      if (p && !isExpired(p)) {
        setToken(t);
        setPayload(p);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  function saveToken(t) {
    if (t) {
      const p = decodeToken(t);
      if (!p || isExpired(p)) {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setPayload(null);
        return;
      }
      localStorage.setItem(STORAGE_KEY, t);
      setToken(t);
      setPayload(p);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setToken(null);
      setPayload(null);
    }
  }

  const value = {
    token,
    user: payload,
    role: payload?.role || null,
    isAuthenticated: !!token && !isExpired(payload),
    isAdmin: payload?.role === "admin",
    isUser: payload?.role === "user",
    login: (t) => saveToken(t),
    logout: () => saveToken(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
