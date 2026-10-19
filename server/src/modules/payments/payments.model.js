import mongoose from 'mongoose';

const paymentsSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const PaymentsModel =
  mongoose.models.Payments ||
  mongoose.model('Payments', paymentsSchema);
