import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    /* const conn = await mongoose.connect(process.env.MONGO_URI); */
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('mongo db connected');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default connectDB;
