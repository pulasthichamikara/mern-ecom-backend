import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//@desc Create new order
//@route POST /api/orders
//@access private
const addOrederItem = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    try {
      const createdOreder = await Order.create({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        createdAt: new Date().toString(),
      });

      res
        .status(201)
        .json({ message: 'Placed the order', order: createdOreder });
    } catch (err) {
      throw new Error('Error in creating order');
    }
  }
});

//@desc Get Order details
//@route GET /api/orders/:id
//@access private
const getOrderById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findById(id).populate('user', 'name email');
    if (order) {
      res.status(200).json({ order });
    } else {
      throw new Error('canot find the order');
    }
  } catch (err) {
    throw new Error('canot find the order');
  }
});

//@desc Update order payment
//@route PUT /api/orders/:id/pay
//@access private
const upadateOrderPayments = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        updateTime: req.body.update_time,
        emailAddress: req.body.payer.email_address,
      };

      try {
        const updatedOrder = await order.save();

        if (updatedOrder) {
          res.status(200).json({ updatedOrder });
        } else {
          throw new Error('issue is updaing order');
        }
      } catch (err) {
        throw new Error('order canot be saved');
      }
    } else {
      throw new Error('there is an issue with the order');
    }
  } catch (err) {
    throw new Error('canot find the order', err);
  }
});

//@desc Get users orders
//@route GET /api/orders/myorders
//@access private

const myOrders = asyncHandler(async (req, res) => {
  try {
    const myOrderList = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(myOrderList);
  } catch (err) {
    throw new Error(err);
  }
});

//@desc Get all orders
//@route GET /api/orders
//@access private

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  if (orders) {
    res.status(200).json(orders);
  } else {
    throw new Error('no any orders');
  }
});

export {
  addOrederItem,
  getOrderById,
  upadateOrderPayments,
  myOrders,
  getOrders,
};
