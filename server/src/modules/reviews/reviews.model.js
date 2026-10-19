import mongoose from 'mongoose';

const reviewsSchema = new mongoose.Schema(
  {},
  { timestamps: true, strict: false }
);

export const ReviewsModel =
  mongoose.models.Reviews ||
  mongoose.model('Reviews', reviewsSchema);
