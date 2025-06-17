import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReportIncident from "./pages/ReportIncident";
import AdminDashboard from "./pages/AdminDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "bg-dark text-light min-vh-100" : "bg-light text-dark min-vh-100"}>
      <Router>
        {/* Navbar */}
        <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"} shadow-sm`}>
          <div className="container">
            <Link className="navbar-brand fw-bold" to="/">
              🚨 Emergency Platform
            </Link>
            <div className="d-flex align-items-center gap-3">
              <Link className="nav-link" to="/report">Report</Link>
              <Link className="nav-link" to="/admin">Admin</Link>
              <Link className="nav-link" to="/responder">Responder</Link>
              <button className="btn btn-sm btn-outline-primary" onClick={toggleTheme}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <div className="container py-4">
          <Routes>
            <Route path="/" element={<ReportIncident />} />
            <Route path="/report" element={<ReportIncident />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/responder" element={<ResponderDashboard />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
