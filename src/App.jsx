import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import Settings from "./Pages/Settings";
import { userAuthStore } from "./Store/useAuthStore";
import FadeLoader from "react-spinners/FadeLoader";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  const { userData, checkAuth, isCheckingAuth } = userAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ userData });

  if (isCheckingAuth && !userData) {
    return (
      <div className="flex items-center justify-center h-screen t ">
        <FadeLoader />
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Protected Pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/settings" element={<Settings />} />

          {/* Authentication pages */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
