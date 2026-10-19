import mongoose from 'mongoose';

const authSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const AuthModel =
  mongoose.models.Auth ||
  mongoose.model('Auth', authSchema);
