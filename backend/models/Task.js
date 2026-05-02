const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  assignedTo: String, // just storing email for simplicity
  status: {
    type: String,
    default: "todo"
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  qualityScore: {
    accuracy: Number,
    completeness: Number,
    average: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", TaskSchema);