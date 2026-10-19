const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
      index: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
      index: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    actualEntryTime: {
      type: Date,
    },
    actualExitTime: {
      type: Date,
    },
    estimatedAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED'],
      default: 'CONFIRMED',
      index: true,
    },
    idempotencyKey: {
      type: String,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// High performance index for reservation conflict detection
reservationSchema.index({ slot: 1, startTime: 1, endTime: 1, status: 1 });
reservationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Reservation', reservationSchema);
