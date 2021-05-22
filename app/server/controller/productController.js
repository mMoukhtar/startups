import Debug from 'debug';
import mongoose from 'mongoose';

import CustomError from '../utils/CustomError.js';
import { asyncErrorsHandler } from '../utils/errorsHandler.js';

const debug = Debug('app:productController');
const Product = mongoose.model('Product');

const getMostSellingProducts = () => Product.find().sort({ rating: -1 }).limit(4);

/**
 * Get All Products
 * @param {Request} req  request object.
 * @param {Response} res response object.
 * @route GET api/products
 * @access public
 */
const getProducts = asyncErrorsHandler(async (req, res) => {
  const { mostSelling } = req.query;
  let products;
  if (mostSelling) {
    products = await getMostSellingProducts();
  } else {
    products = await Product.find();
  }

  return res.status(200).json({ data: { products } });
});

const findProductById = async (req, res, next) => {
  try {
    const { brand, id } = req.params;
    const product = await Product.findById(id);
    if (product) {
      req.product = product;
      return next();
    }
    res.status(404);
    throw new CustomError(CustomError.types.db.recordNotFound, 404, 'Product not found');
  } catch (error) {
    next(error);
  }
};

const getProductById = asyncErrorsHandler(async ({ product }, res) => {
  return res.status(200).json({ data: { product } });
});

const findProductByBrand = async (req, res, next) => {
  try {
    const { brand } = req.params;
    const products = await Product.find({ brand: 'apple' });
    if (products) {
      req.products = products;
      return next();
    }
    res.status(404);
    throw new CustomError(
      CustomError.types.db.recordNotFound,
      404,
      `There are no products under ${brand} brand`
    );
  } catch (error) {
    next(error);
  }
};

const getProductByBrand = asyncErrorsHandler(async ({ products }, res) => {
  return res.status(200).json({ data: { products } });
});

export { getProducts, findProductById, getProductById, findProductByBrand, getProductByBrand };
