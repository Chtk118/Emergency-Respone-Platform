import React, { useEffect, useState, useRef } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCoords, setSearchCoords] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await axios.get("https://emergency-respone-platform.onrender.com/api/incidents");
        setIncidents(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching incidents:", err);
      }
    };

    fetchIncidents();
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const filterByProximity = (data, coords, radiusKm) => {
    return data.filter((incident) => {
      const [lat, lng] = incident.location.split(",").map(Number);
      return getDistance(lat, lng, coords[0], coords[1]) <= radiusKm;
    });
  };

  const handleFilterChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    let filteredList = incidents;
    if (type !== "All") {
      filteredList = filteredList.filter((i) => i.type === type);
    }
    if (searchCoords) {
      filteredList = filterByProximity(filteredList, searchCoords, 2);
    }
    setFiltered(filteredList);
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) {
      setFiltered(selectedType === "All" ? incidents : incidents.filter(i => i.type === selectedType));
      return;
    }
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: searchQuery,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "EmergencyPlatformApp/1.0 (krishna@example.com)"
        }
      });

      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        const coords = [parseFloat(lat), parseFloat(lon)];
        setSearchCoords(coords);
        mapRef.current.setView(coords, 13);

        let list = selectedType === "All" ? incidents : incidents.filter(i => i.type === selectedType);
        const filteredNearby = filterByProximity(list, coords, 2);
        setFiltered(filteredNearby);
      } else {
        alert("No location found.");
      }
    } catch (err) {
      console.error("Search failed:", err);
      alert("Geocoding error.");
    }
  };

  const markResolved = async (id) => {
    try {
      await axios.patch(`https://emergency-respone-platform.onrender.com/api/incidents/${id}`);;
      setFiltered((prev) =>
        prev.map((i) => (i._id === id ? { ...i, status: "Resolved" } : i))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="glow-title fw-bold text-center">🧠 Admin Dashboard</h2>

      <div className="row mt-4 mb-4">
        <div className="col-md-4">
          <label className="form-label fw-bold">Filter by Type</label>
          <select
            className="form-select"
            value={selectedType}
            onChange={handleFilterChange}
          >
            <option value="All">All</option>
            <option value="Medical">Medical</option>
            <option value="Fire">Fire</option>
            <option value="Police">Police</option>
          </select>
        </div>
        <div className="col-md-8">
          <label className="form-label fw-bold">Search Location (Optional)</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Gachibowli, Hyderabad"
            />
            <button className="btn btn-outline-secondary" onClick={handleSearchLocation}>
              Search
            </button>
          </div>
        </div>
      </div>

      <MapContainer
        center={[17.3850, 78.4867]}
        zoom={12}
        style={{ height: "400px" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {filtered.map((incident, index) => {
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

      <div className="mt-4">
        <h5 className="fw-bold text-danger">Reported Incidents</h5>
        <div className="row">
          {filtered.map((incident, index) => (
            <div className="col-md-6 fade-slide mb-3" key={incident._id}>
              <div className="card shadow border-danger border-2">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{incident.type}</h5>
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
    </div>
  );
}

export default AdminDashboard;
