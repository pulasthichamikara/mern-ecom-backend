import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';
import * as fs from 'node:fs';
import fetch from 'node-fetch';
import axios from 'axios';
import storage from '../config/firebaseData.js';

import { ref, uploadBytes, listAll, deleteObject } from 'firebase/storage';

const url = 'https://i.dummyjson.com/data/products/1/4.jpg';
const dataUrl = 'https://dummyjson.com/products?limit=20';

/* const addDummyData = asyncHandler(async (req, res) => {
  const prductData = getData();
  res.json({ prductData });
}); */

const addDummyData = asyncHandler(async (req, res) => {
  /*   await axios
    .get(dataUrl, {
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' },
    })
    .then((response) => {
      if (response) {
        savedata(response.data);
      }
    })
    .catch((error) => {
      console.log(error);
    }); */
});

const savedata = asyncHandler(async (data, req, res) => {
  data.products.map(async (item) => {
    const image = await saveImage(item.images[0]);

    const productData = {
      name: item.title,
      price: item.price,
      category: item.category,
      image: item.title,
      description: item.description,
      brand: item.brand,
      countInStock: item.stock,
      image: image,
      user: '637ce1b540acaaca5fdcd675',
    };

    try {
      await Product.create(productData);
    } catch (err) {
      console.log(err);
    }
    return res.json({ message: 'done' });
  });
});

/* const saveImage = asyncHandler(async (url, req, res) => {
  const response = await fetch(url);
  const buffer = await response.buffer();
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  let imgName = `/uploads/${uniqueSuffix}-image.jpg`;
  try {
    const saveImg = await fs.writeFile(
      `./uploads/${uniqueSuffix}-image.jpg`,
      buffer,
      (err) => {}
    );
    console.log(saveImg);
  } catch (err) {}
  return imgName;
}); */

const saveImage = asyncHandler(async (url, req, res) => {
  const response = await fetch(url);
  const buffer = await response.buffer();

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const imageRef = ref(storage, uniqueSuffix + 'image');

  await uploadBytes(imageRef, buffer)
    .then((snapshot) => {
      console.log(snapshot);
      res.send(snapshot.metadata.name);
    })
    .catch((error) => console.log(error.message));
});

export { addDummyData };
