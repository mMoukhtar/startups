import express from 'express';
import Debug from 'debug';

import * as productController from '../../controller/productController.js';

const debug = Debug('app:productRoutes');
const productRoutes = express.Router();

productRoutes.route('/').get(productController.getProducts);

productRoutes
  .route('/:brand')
  .all(productController.findProductByBrand)
  .get(productController.getProductByBrand);

productRoutes
  .route('/:brand/:id')
  .all(productController.findProductById)
  .get(productController.getProductById);

export default productRoutes;
