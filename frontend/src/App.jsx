import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import AdminDashboard from "./pages/AdminDashboard";
import Onboarding from "./pages/Onboarding";
import UsersPage from "./pages/Users";
import Audit from "./pages/Audit";
import NotFound from "./pages/NotFound";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? (user.role === "ADMIN" ? "/admin" : "/dashboard") : "/login"} replace/>;
}

function AppRoutes() {
  return <Routes>
    <Route path="/" element={<HomeRedirect/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route element={<ProtectedRoute/>}>
      <Route element={<AppLayout/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/accounts" element={<Accounts/>}/>
      </Route>
    </Route>
    <Route element={<ProtectedRoute admin/>}>
      <Route element={<AppLayout/>}>
        <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/admin/onboarding" element={<Onboarding/>}/>
        <Route path="/admin/users" element={<UsersPage/>}/>
        <Route path="/admin/audit" element={<Audit/>}/>
      </Route>
    </Route>
    <Route path="*" element={<NotFound/>}/>
  </Routes>;
}

export default function App() {
  return <AuthProvider><AppRoutes/></AuthProvider>;
}
