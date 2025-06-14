import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Component to select location on map
function LocationMarker({ setFormData }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setFormData((prev) => ({
        ...prev,
        location: `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`
      }));
    },
  });

  return position === null ? null : <Marker position={position} />;
}

function ReportIncident() {
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/incidents", formData);
      alert("Incident submitted successfully!");
      setFormData({ type: "", location: "", description: "" });
    } catch (err) {
      console.error("Error submitting incident:", err);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-danger">Report an Emergency</h2>

      <form onSubmit={handleSubmit}>
        {/* Type of Emergency */}
        <div className="mb-3">
          <label className="form-label">Type of Emergency</label>
          <select
            className="form-select"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Type --</option>
            <option value="Medical">Medical</option>
            <option value="Fire">Fire</option>
            <option value="Police">Police</option>
          </select>
        </div>

        {/* Map for Location */}
        <div className="mb-3">
          <label className="form-label">Click on the map to select location</label>
          <MapContainer
            center={[17.3850, 78.4867]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "300px", borderRadius: "8px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker setFormData={setFormData} />
          </MapContainer>

          <input
            type="text"
            className="form-control mt-2"
            name="location"
            value={formData.location}
            readOnly
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-danger">
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default ReportIncident;
