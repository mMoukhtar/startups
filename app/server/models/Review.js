import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: 'product',
    },
    name: {
      type: String,
      required: 'Please provide a valid review name',
      trim: true,
    },
    rating: {
      type: Number,
      required: 'Please provide a rating',
    },

    comment: {
      type: String,
      required: 'Please provide a valid comment',
      trim: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
