import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, requird: true },
    rating: { type: Number, requird: true },
    comment: { type: String, requird: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      requird: true,
    },
    image: {
      type: String,
      requird: true,
    },
    brand: {
      type: String,
      requird: true,
    },
    category: {
      type: String,
      requird: true,
    },
    reviews: [reviewSchema],
    totalRating: {
      type: Number,
      requird: true,
      default: 0,
    },
    description: {
      type: String,
      requird: false,
    },
    numOfReviews: {
      type: Number,
      requird: true,
      default: 0,
    },
    price: {
      type: Number,
      requird: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      requird: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
