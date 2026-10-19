import mongoose from 'mongoose';

const notificationsSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const NotificationsModel =
  mongoose.models.Notifications ||
  mongoose.model('Notifications', notificationsSchema);
