import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (
      !token &&
      location.pathname !== "/" &&
      !location.pathname.includes("/auth")
    ) {
      navigate("/auth");
    }
  }, [navigate, location]);

  return <>{children}</>;
};

export default AuthGuard;
