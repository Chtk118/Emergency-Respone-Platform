const express = require("express");
const router = express.Router();
const Incident = require("../models/Incident");

// POST: Report new incident
router.post("/", async (req, res) => {
  try {
    const incident = new Incident(req.body);
    const saved = await incident.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Fetch all incidents
router.get("/", async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ timestamp: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Mark an incident as resolved
router.patch("/:id", async (req, res) => {
  try {
    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      { status: "Resolved" },
      { new: true }
    );
    if (!updatedIncident) {
      return res.status(404).json({ error: "Incident not found" });
    }
    res.json(updatedIncident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
