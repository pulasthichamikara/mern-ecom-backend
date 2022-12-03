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

import fileUpload from './routes/fileUpload.js';
import firebaseFileupload from './routes/firebaseFileUpload.js';
import path from 'path';
import { addDummyData } from './controller/dataInsert.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.listen(4000, console.log('running backend'));

app.get('/', (req, res) => {
  res.send('running');
});

app.get('/api/uploadtest', addDummyData);

app.use('/api/products', ProductRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});
/* upload  */
/* const __dirname = path.resolve();
app.use('/uploads', express.static(path.join('/uploads'))); */

// const __dirname = path.resolve();
// app.use('/api/uploadsDirect/', express.static(__dirname + '/uploads'), fileUpload);
// console.log(path.join(__dirname));

app.use('/api/uploads/', firebaseFileupload);

/* end uplolad */

app.use(NotFound);

app.use(ErrorHandler);
