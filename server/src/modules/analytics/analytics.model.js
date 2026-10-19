import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const AnalyticsModel =
  mongoose.models.Analytics ||
  mongoose.model('Analytics', analyticsSchema);
