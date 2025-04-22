import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./services/ProtectedRoute";
import "../src/styles/App.css";
import App from "./App";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login role="user" />} />
      <Route path="/signup" element={<Signup role="user" />} />
      <Route element={<ProtectedRoute />}>
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<UserProfile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
