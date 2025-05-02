

import React from 'react'
import { userAuthStore } from '../Store/useAuthStore'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
   const { userData } = userAuthStore;

   if (!userData) return <Navigate to="/login"/>

   return <Outlet />

}

export default ProtectedRoute