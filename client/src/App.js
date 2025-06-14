import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import ReportIncident from "./pages/ReportIncident";
import AdminDashboard from "./pages/AdminDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/responder" element={<ResponderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
