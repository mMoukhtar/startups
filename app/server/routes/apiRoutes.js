import express from 'express';

import userRoutes from './api/userRoutes.js';
import authRoutes from './api/authRoutes.js';
import productRoutes from './api/productRoutes.js';
import reviewRoutes from './api/reviewRoutes.js';

const apiRoutes = express.Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/users', userRoutes);
apiRoutes.use('/products', productRoutes);
apiRoutes.use('/reviews', reviewRoutes);

export default apiRoutes;
