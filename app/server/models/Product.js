import mongoose from 'mongoose';
import slug from 'slug';

import Review from './Review.js';
import CustomError from '../utils/CustomError.js';

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: 'Please provide a valid product name',
      trim: true,
    },
    brand: {
      type: String,
      required: 'Please provide a valid product brand',
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: 'Please provide a valid product description',
      trim: true,
    },
    image: {
      type: String,
      required: 'Please provide a valid URL',
    },
    category: {
      type: String,
      required: 'Please provide a valid product category',
      trim: true,
    },
    slug: { type: String },
    countInStock: { type: Number, default: 0 },
    price: { type: Number, required: 'Please provide a valid product price' },
    onSale: { type: Boolean, default: false },
    onSalePrice: { type: Number, default: 0 },
    reviews: [Review.schema],
    rating: { type: Number, required: true, default: 0 },
    noOfReviews: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

//FIXME: Make sure to have a unique slug
productSchema.pre('save', async function (next) {
  if (!this.isModified('name') && !this.isModified('brand')) return next(); // skip if either name or brand isn't modified
  // we need to make a unique slug
  try {
    const slugRegEx = new RegExp(`^(${this.brand} ${this.name})((-[0-9]*$)?)$`, 'i');
    const storeWithSlug = this.constructor.find({ slug: slugRegEx });
    if (storeWithSlug.length)
      this.slug = slug(`${this.brand} ${this.name}-${storeWithSlug.length + 1}`);
    else this.slug = slug(`${this.brand} ${this.name}`);
  } catch (error) {
    throw new CustomError(CustomError.types.db.faildToCreate, 500, 'Faild to add product slug');
  } finally {
    next();
  }
});

productSchema.pre('insertMany', (next, docs) => {
  docs.forEach((doc) => {
    doc.slug = slug(`${doc.brand} ${doc.name}`);
  });
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
