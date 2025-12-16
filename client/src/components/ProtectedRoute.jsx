import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/admin/verify", {
          method: "GET",
          credentials: "include", // Important for cookies
        });
        console.log(response)
        const data = await response.json();
        console.log(data)
        setIsAuthenticated(data.isLoggedIn);
      } catch (error) {
        setIsAuthenticated(false);
      }

    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF9F6]">
        <Loader2 className="animate-spin text-[#C9A24D]" size={40} />
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin-portal-secret" replace />
  );
};

export default ProtectedRoute;
