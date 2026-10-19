import mongoose from 'mongoose';

const slotsSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const SlotsModel =
  mongoose.models.Slots ||
  mongoose.model('Slots', slotsSchema);
