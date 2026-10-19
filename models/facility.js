const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Facility address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      index: true,
    },
    state: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
    },
    pricing: {
      hourlyRate: {
        type: Number,
        required: true,
        min: 0,
        default: 10,
      },
    },
    operatingHours: {
      open: { type: String, default: '00:00' },
      close: { type: String, default: '23:59' },
    },
    totalSlots: {
      type: Number,
      default: 50,
    },
    amenities: {
      type: [String],
      default: ['CCTV', 'COVERED'],
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for search performance
facilitySchema.index({ city: 1, isActive: 1 });

module.exports = mongoose.model('Facility', facilitySchema);
