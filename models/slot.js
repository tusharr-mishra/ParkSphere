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

// Compound unique index ensuring each slot number is unique within its facility
slotSchema.index({ facility: 1, slotNumber: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
