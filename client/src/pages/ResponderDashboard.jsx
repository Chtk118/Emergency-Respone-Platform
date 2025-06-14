import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

function ResponderDashboard() {
  const [responderType, setResponderType] = useState("Medical");
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/incidents");
        const filtered = res.data.filter((i) => i.type === responderType);
        setIncidents(filtered);
      } catch (err) {
        console.error("Error fetching incidents:", err);
      }
    };

    fetchIncidents();
  }, [responderType]);

  return (
    <div className="container mt-5">
      <h2 className="text-center text-success mb-4">Responder Dashboard</h2>

      {/* Responder Role Selector */}
      <div className="mb-4 text-center">
        <label className="me-2">Responder Role:</label>
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

      {/* Map with role-specific incidents */}
      <MapContainer
        center={[17.3850, 78.4867]}
        zoom={12}
        style={{ height: "400px", borderRadius: "10px", marginBottom: "30px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {incidents.map((incident, index) => {
          const [lat, lng] = incident.location.split(",").map(Number);
          return (
            <Marker key={incident._id || index} position={[lat, lng]}>
              <Popup>
                <strong>{incident.type}</strong><br />
                {incident.description}<br />
                <small>{incident.location}</small>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* List of filtered incidents */}
      <h4>Assigned Incidents ({incidents.length})</h4>
      {incidents.length === 0 ? (
        <p className="text-muted">No incidents to respond to.</p>
      ) : (
        <ul className="list-group">
          {incidents.map((incident) => (
            <li className="list-group-item" key={incident._id}>
              <strong>{incident.type}</strong> — {incident.description}<br />
              <small>Location: {incident.location}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResponderDashboard;
