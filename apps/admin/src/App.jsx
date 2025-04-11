import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./services/ProtectedRoute";
import './App.css'; 

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login role="admin" />} />
        <Route path="/signup" element={<Signup role="admin" />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin-dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
