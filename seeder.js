import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Order from './models/orderModel.js';
import Product from './models/productModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createUsers = await User.insertMany(users);
    const AdminUser = createUsers[0]._id;
    const sampleProducts = products.map((p) => {
      return { ...p, user: AdminUser };
    });
    await Product.insertMany(sampleProducts);
    console.log('data imported');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('destroyed data');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[1] === '-d') {
  destroyData();
} else {
  importData();
}
