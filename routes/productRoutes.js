import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProductById,
  addProduct,
  editProduct,
  productReview,
  topRatedProducts,
} from '../controller/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, addProduct);
router.route('/topRated').get(topRatedProducts);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, editProduct)
  .delete(protect, admin, deleteProductById);

router.route('/:id/review').post(protect, productReview);

export default router;
