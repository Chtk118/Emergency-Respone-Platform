import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "../index.css";

function ResponderDashboard() {
  const [responderType, setResponderType] = useState("Medical");
  const [incidents, setIncidents] = useState([]);

  const roleColors = {
    Medical: "#28a745",
    Fire: "#dc3545",
    Police: "#007bff"
  };

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get("https://emergency-respone-platform.onrender.com/api/incidents");
        const filtered = res.data.filter((i) => i.type === responderType);
        setIncidents(filtered);
      } catch (err) {
        console.error("Error fetching incidents:", err);
      }
    };

    fetchIncidents();
  }, [responderType]);

  const markResolved = async (id) => {
    try {
     await axios.patch(`https://emergency-respone-platform.onrender.com/api/incidents/${id}`);
      setIncidents((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status: "Resolved" } : i))
      );
    } catch (err) {
      alert("Failed to mark as resolved.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h2 className="glow-title" style={{ color: roleColors[responderType] }}>
          🚑 {responderType} Responder Dashboard
        </h2>
        <p className="text-muted">Respond to your assigned emergencies</p>
      </div>

      <div className="text-center mb-3">
        <select
          className="form-select w-auto d-inline-block"
          value={responderType}
          onChange={(e) => setResponderType(e.target.value)}
        >
          <option value="Medical">Medical</option>
          <option value="Fire">Fire</option>
          <option value="Police">Police</option>
        </select>
      </div>

      <MapContainer
        center={[17.3850, 78.4867]}
        zoom={13}
        style={{ height: "400px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {incidents.map((incident, index) => {
          const [lat, lng] = incident.location.split(",").map(Number);
          return (
            <Marker key={index} position={[lat, lng]}>
              <Popup>
                <strong>{incident.type}</strong><br />
                {incident.description}<br />
                {incident.location}<br />
                <span className={`badge ${incident.status === "Resolved" ? "bg-success" : "bg-warning text-dark"}`}>
                  {incident.status}
                </span>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="row mt-4">
        {incidents.map((incident) => (
          <div className="col-md-6 fade-slide mb-3" key={incident._id}>
            <div className="card border-3" style={{ borderColor: roleColors[responderType] }}>
              <div className="card-body">
                <h5 className="fw-bold">{incident.type}</h5>
                <p>{incident.description}</p>
                <p className="text-muted small">📍 {incident.location}</p>
                <p>
                  <span className={`badge ${incident.status === "Resolved" ? "bg-success" : "bg-warning text-dark"}`}>
                    {incident.status}
                  </span>
                </p>
                {incident.status === "Pending" && (
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => markResolved(incident._id)}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResponderDashboard;
