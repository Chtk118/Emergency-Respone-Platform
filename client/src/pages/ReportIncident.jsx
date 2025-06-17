import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

function LocationMarker({ setFormData }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setFormData((prev) => ({
        ...prev,
        location: `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`
      }));
    }
  });

  return position ? <Marker position={position} /> : null;
}

function ReportIncident() {
  const [formData, setFormData] = useState({
    type: "",
    location: "",
    description: ""
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [markerPos, setMarkerPos] = useState(null);
  const mapRef = useRef();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;

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
        const coordString = `${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`;

        setFormData((prev) => ({ ...prev, location: coordString }));
        setMarkerPos(coords);
        mapRef.current.setView(coords, 14);
      } else {
        alert("No location found. Try something more specific.");
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
      alert("Search failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://emergency-respone-platform.onrender.com/api/incidents", formData);
      alert("Incident submitted successfully!");
      setFormData({ type: "", location: "", description: "" });
      setSearchQuery("");
      setMarkerPos(null);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Submission failed.");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h2 className="card-title text-center text-danger mb-4">
                🚨 Report an Emergency
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Emergency Type */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Type of Emergency</label>
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

                {/* Optional Place Name Input */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Search by Place Name (Optional)</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Charminar, Hyderabad"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleSearchLocation}
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Map */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Click on the Map to Select Location</label>
                  <MapContainer
                    center={[17.3850, 78.4867]}
                    zoom={13}
                    style={{ height: "300px", borderRadius: "8px" }}
                    whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    <LocationMarker setFormData={setFormData} />
                    {markerPos && <Marker position={markerPos} />}
                  </MapContainer>
                </div>

                {/* Coordinates Field */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Coordinates (lat, lng)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Click on map or search above"
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    placeholder="Describe the emergency..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn btn-danger px-4">
                    Submit Report
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportIncident;
