import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import SettingsPage from "./Pages/SettingsPage";
import { useAuthStore } from "./Store/useAuthStore";
import FadeLoader from "react-spinners/FadeLoader";
import ProtectedRoute from "./Components/ProtectedRoute";
import AuthGuard from "./Components/AuthGuard";
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from "./Store/useThemeStore";

const App = () => {
  const { theme } = useThemeStore();
  const { userData, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !userData) {
    return (
      <div className="flex items-center justify-center h-screen t ">
        <FadeLoader />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="relative min-h-screen pt-16 sm:pt-24 lg:pt-30">
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar />

        <Routes>
          {/* Protected Pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/settings" element={<SettingsPage />} />

          {/* Authentication pages */}
          <Route element={<AuthGuard />}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
