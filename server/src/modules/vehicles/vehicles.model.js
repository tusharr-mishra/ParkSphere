import mongoose from 'mongoose';

const vehiclesSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const VehiclesModel =
  mongoose.models.Vehicles ||
  mongoose.model('Vehicles', vehiclesSchema);
