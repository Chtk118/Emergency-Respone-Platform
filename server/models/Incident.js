const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Medical", "Fire", "Police"]
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved"],
    default: "Pending"
  }
});

module.exports = mongoose.model("Incident", incidentSchema);
