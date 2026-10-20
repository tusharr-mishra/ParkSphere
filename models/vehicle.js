// Vehicle Model: customer registered vehicle with type and EV status
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Vehicle registration number is required'],
      uppercase: true,
      trim: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ['COMPACT', 'SEDAN', 'SUV', 'TWO_WHEELER'],
      default: 'SEDAN',
    },
    isEV: {
      type: Boolean,
      default: false,
    },
    make: {
      type: String,
      default: '',
    },
    model: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
