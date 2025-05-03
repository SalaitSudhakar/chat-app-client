import React from "react";
import { useAuthStore } from "../Store/useAuthStore.js";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
  const { userData } = useAuthStore();

  if (userData) return <Navigate to="/" />;

  return <Outlet />;
};

export default AuthGuard;
