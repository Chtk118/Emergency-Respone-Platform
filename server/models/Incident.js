const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
  type: String,
  description: String,
  location: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Incident", incidentSchema);
