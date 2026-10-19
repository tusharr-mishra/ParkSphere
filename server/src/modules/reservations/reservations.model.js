import mongoose from 'mongoose';

const reservationsSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const ReservationsModel =
  mongoose.models.Reservations ||
  mongoose.model('Reservations', reservationsSchema);
