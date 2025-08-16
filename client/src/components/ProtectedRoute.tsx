import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { refreshAccess} from "../api";


export default function ProtectedRoute() {

  const [status, setStatus] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    refreshAccess()
    .then(() => setStatus("allowed"))
    .catch(() => setStatus("denied"));
  }, []);

  if (status === "loading") {
    return <div>Authenticating...</div>;
  } else if (status === "allowed") {
    return <Outlet />
  } else {
    return <Navigate to="/login" replace />
  }
  ;
}