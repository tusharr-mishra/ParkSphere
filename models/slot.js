// Slot Model: individual parking bay with type, EV status, and operational state
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
      index: true,
    },
    slotNumber: {
      type: String,
      required: [true, 'Slot number is required'],
      trim: true,
    },
    slotType: {
      type: String,
      enum: ['COMPACT', 'SEDAN', 'SUV', 'TWO_WHEELER'],
      default: 'SEDAN',
    },
    isEV: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE'],
      default: 'AVAILABLE',
      index: true,
    },
  },
  { timestamps: true }
);

// Ensure slot numbers are unique per facility
slotSchema.index({ facility: 1, slotNumber: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
