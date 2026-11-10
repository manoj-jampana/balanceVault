import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const DEMO_KEY = "balancevault_demo_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem(DEMO_KEY)) || null; }
    catch { return null; }
  });

  const loginDemo = (email, role = "USER") => {
    const demoUser = {
      id: role === "ADMIN" ? "demo-admin" : "demo-user",
      name: role === "ADMIN" ? "Demo Administrator" : "Demo User",
      email,
      role,
      status: role === "ADMIN" ? "APPROVED" : "APPROVED",
    };
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const registerDemo = (name, email) => {
    const demoUser = { id: `demo-${Date.now()}`, name, email, role: "USER", status: "PENDING" };
    sessionStorage.setItem(DEMO_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const logout = () => {
    sessionStorage.removeItem(DEMO_KEY);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loginDemo, registerDemo, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
