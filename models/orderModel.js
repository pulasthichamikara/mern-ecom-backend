import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      requird: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, requird: true },
        quntity: { type: Number, requird: true },
        image: { type: String, requird: true },
        price: { type: Number, requird: true },
      },
    ],
    shippingAddress: {
      address: { type: String, requird: true },
      city: { type: String, requird: true },
      zipCode: { type: String, requird: true },
      country: { type: String, requird: true },
    },
    paymentMethod: {
      type: String,
      requird: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      updateTime: { type: String },
      emailAddress: { type: String },
    },
    taxPrice: {
      type: Number,
      requird: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      requird: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      requird: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      requird: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      requird: true,
      default: false,
    },
    createdAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
