import express from 'express';
import Debug from 'debug';

import * as reviewController from '../../controller/reviewController.js';

const debug = Debug('app:reviewRoutes');
const reviewRoutes = express.Router();

reviewRoutes.route('/').get(reviewController.getReviews);

export default reviewRoutes;
