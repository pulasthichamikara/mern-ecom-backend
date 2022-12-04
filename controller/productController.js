import e from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { deleteFirebaseImg } from '../routes/firebaseFileUpload.js';

//@desc fetch all products
//@route GET /api/products
//@access public
const getProducts = asyncHandler(async (req, res) => {
  const perPage = 20;
  const page = Number(req.query.pageNumber) || 1;
  const keyword =
    req.query.q != ''
      ? {
          name: {
            $regex: req.query.q,
            $options: 'i',
          },
        }
      : {};
  const productCount = await Product.count({ ...keyword });

  const products = await Product.find({ ...keyword })
    .sort({ createdAt: -1 })
    .limit(perPage)
    .skip((page - 1) * perPage);
  /* 
    .limit(perPage)
    D */
  const pages = Math.ceil(productCount / perPage);
  res.json({ products, page, pages });
});

//@desc fetch single products
//@route GET /api/products/:id
//@access public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc fetch top rated products
//@route GET /api/products/top
//@access public
const topRatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.find({}).sort({ totalRating: -1 }).limit(3);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@desc delete user
//@route delete /api/users/:id
//@access private
const deleteProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await deleteFirebaseImg(product.image);
    await product.remove();
    res.status(200);
    res.json({ message: 'Product removed successfully' });
  } else {
    res.status(404);
    throw new EvalError('Product could not found');
  }
});

//@desc add product
//@route post /api/products/
//@access private
const addProduct = asyncHandler(async (req, res) => {
  const productData = req.body;
  const user = req.user._id;
  const productToSave = { ...productData, user };

  const newProduct = await Product.create(productToSave);

  if (newProduct) {
    res.status(200);
    res.json(newProduct);
  } else {
    res.status(404);
    throw new EvalError('can not save the product');
  }
});

//@desc edit product
//@route put /api/products/:id
//@access private
const editProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  const user = req.user_id;
  const existingProdcut = await Product.findById(req.params.id);
  if (existingProdcut) {
    existingProdcut.name = name || existingProdcut.name;
    existingProdcut.price = price || existingProdcut.price;
    existingProdcut.description = description || existingProdcut.description;
    existingProdcut.image = image || existingProdcut.image;
    existingProdcut.brand = brand || existingProdcut.brand;
    existingProdcut.category = category || existingProdcut.category;
    existingProdcut.countInStock = countInStock || existingProdcut.countInStock;
    const updatedProduct = await existingProdcut.save();
    res.status(200);
    res.json(updatedProduct);
  } else {
    throw new EvalError('Product is not added');
  }
});

//@desc product review
//@route post /api/products/:id/reviews
//@access private

const productReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewd = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    /*   if (alreadyReviewd) {
      res.status(400);
      throw new Error('product already reviewd');
    } */
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);

    const totalRating = product.reviews.reduce((acc, r) => {
      acc = acc + r.rating;
      return acc;
    }, 0);
    product.numOfReviews = product.reviews.length;
    product.totalRating = Number(
      (totalRating / product.reviews.length).toFixed(2)
    );

    const updatedProduct = await product.save();

    res.status(200).json({ updatedProduct });
  } else {
    res.status(404);
    throw new Error('product not found');
  }
});

export {
  getProducts,
  getProductById,
  deleteProductById,
  addProduct,
  editProduct,
  productReview,
  topRatedProducts,
};
