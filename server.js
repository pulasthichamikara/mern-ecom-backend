import express from 'express';
import products from './products.js';
import cors from 'cors';
import connectDB from './config/db.js';
import * as dotenv from 'dotenv';
import ProductRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { NotFound, ErrorHandler } from './middleware/errorHandler.js';
import morgan from 'morgan';

/* import fileUpload from './routes/fileUpload.js'; */
import firebaseFileupload from './routes/firebaseFileUpload.js';
/* import path from 'path'; */

dotenv.config();
connectDB().then(() => {
  app.listen(process.env.PORT || 4000, console.log('running backend'));
});

const app = express();
app.use(cors());
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.get('/', (req, res) => {
  res.send('running');
});

app.use('/api/products', ProductRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

/* upload  */
app.use('/api/uploads/', firebaseFileupload);

app.use(NotFound);

app.use(ErrorHandler);
