import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const AdminModel =
  mongoose.models.Admin ||
  mongoose.model('Admin', adminSchema);
