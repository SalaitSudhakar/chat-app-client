import React from "react";
import { useAuthStore } from "../Store/useAuthStore.js";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { userData } = useAuthStore();

  if (!userData) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;
