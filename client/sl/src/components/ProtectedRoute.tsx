import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { refreshAccess} from "../api";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {

  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    console.log("ProtectedRoute useEffect firing.");
    refreshAccess()
    .then(() => setStatus("allowed"))
    .catch(() => setStatus("denied"));
  }, []);

  if (status === "loading") {
    return <div>Authenticating...</div>;
  }

  if (status === "denied") {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>;
}