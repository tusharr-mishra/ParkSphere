// Review model - customer ratings and feedback for parking facilities
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, 'Please provide feedback in your review'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
