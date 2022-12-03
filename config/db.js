import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URI);
    console.log('mongo db connected');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default connectDB;
