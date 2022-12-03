import express from 'express';
import {
  addOrederItem,
  getOrderById,
  upadateOrderPayments,
  myOrders,
  getOrders,
} from '../controller/orderController.js';

import { admin, protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, addOrederItem).get(getOrders);
router.route('/myorders').get(protect, myOrders);
router.route('/:id/pay').put(protect, upadateOrderPayments);
router.route('/:id').get(protect, getOrderById);

export default router;
