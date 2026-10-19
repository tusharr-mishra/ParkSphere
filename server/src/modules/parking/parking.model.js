import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const ParkingModel =
  mongoose.models.Parking ||
  mongoose.model('Parking', parkingSchema);
