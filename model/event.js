const mongoose = require('mongoose');

// Event schema
const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1, // Capacity should be at least 1
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0, // Available seats should be at least 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Links to the user who created the event
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create Event model
module.exports = mongoose.model('Event', eventSchema);
