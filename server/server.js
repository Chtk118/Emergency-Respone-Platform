const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
const incidentRoutes = require("./routes/incidents");
app.use("/api/incidents", incidentRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Emergency Response Backend is Running 🚀");
});

// ✅ IMPORTANT: Use Render’s dynamic port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
