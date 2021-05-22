import Debug from 'debug';
import mongoose from 'mongoose';

import { asyncErrorsHandler } from '../utils/errorsHandler.js';

const debug = Debug('app:reviewController');
const Review = mongoose.model('Review');

// @desc    Fetch all reviews
// @route   GET api/reviews
// @access  public
const getReviews = asyncErrorsHandler(async (req, res) => {
  const reviews = await Review.find();
  return res.status(200).json({ data: { reviews } });
});

export { getReviews };
