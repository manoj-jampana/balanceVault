
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("balancevault_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Login
  const login = async (email, password) => {
    setLoading(true);

    try {
      const result = await api.login(email, password);

      sessionStorage.setItem(
        "balancevault_token",
        result.accessToken
      );

      sessionStorage.setItem(
        "balancevault_user",
        JSON.stringify(result.user)
      );

      setUser(result.user);

      return result;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (fullName, email, password) => {
    setLoading(true);

    try {
      return await api.register(fullName, email, password);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    sessionStorage.removeItem("balancevault_token");
    sessionStorage.removeItem("balancevault_user");
    setUser(null);
  };

  // Restore session from browser storage
  useEffect(() => {
    const storedToken = sessionStorage.getItem("balancevault_token");
    const storedUser = sessionStorage.getItem("balancevault_user");

    if (!storedToken || !storedUser) {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom authentication hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}
