import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const UsersModel =
  mongoose.models.Users ||
  mongoose.model('Users', usersSchema);
