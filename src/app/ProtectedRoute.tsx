import { Navigate } from "react-router";
import { useAuth } from "./contexts/AuthContext";

type Props = {
  children: React.ReactNode;
  role?: "admin" | "user";
};

export default function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth(); // ✅ ADD loading

  // ✅ WAIT for session check
  if (loading) {
    return null; // or loading spinner
  }

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Wrong role
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}