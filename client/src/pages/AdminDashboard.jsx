import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/incidents");
        setIncidents(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching incidents:", err);
      }
    };

    fetchIncidents();
  }, []);

  const handleFilterChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    if (type === "All") {
      setFiltered(incidents);
    } else {
      setFiltered(incidents.filter(i => i.type === type));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Admin Dashboard</h2>

      {/* Filter Dropdown */}
      <div className="mb-3 text-center">
        <label className="form-label me-2">Filter by Type:</label>
        <select
          className="form-select w-auto d-inline-block"
          value={selectedType}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          <option value="Medical">Medical</option>
          <option value="Fire">Fire</option>
          <option value="Police">Police</option>
        </select>
      </div>

      {/* Map */}
      <MapContainer
        center={[17.3850, 78.4867]}
        zoom={12}
        style={{ height: "400px", borderRadius: "10px", marginBottom: "30px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {filtered.map((incident, index) => {
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

      {/* List of Incidents */}
      <h4>Reported Incidents ({filtered.length})</h4>
      {filtered.length === 0 ? (
        <p>No incidents found for this type.</p>
      ) : (
        <ul className="list-group">
          {filtered.map((incident) => (
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

export default AdminDashboard;
