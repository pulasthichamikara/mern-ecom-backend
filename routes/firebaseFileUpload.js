import express from 'express';
import multer from 'multer';
import storage from '../config/firebaseData.js';
import { ref, uploadBytes, listAll, deleteObject } from 'firebase/storage';

const router = express.Router();
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

// upload
router.post('/', upload.single('image'), async (req, res) => {
  const file = req.file;
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const imageRef = ref(storage, uniqueSuffix + file.originalname);
  const metatype = {
    contentType: file.mimetype,
    name: 'img-' + file.originalname,
  };

  await uploadBytes(imageRef, file.buffer, metatype)
    .then((snapshot) => {
      res.send(snapshot.metadata.name);
    })
    .catch((error) => console.log(error.message));
});

// get all images
router.get('/pictures', async (req, res) => {
  const listRef = ref(storage);
  let productPictures = [];
  await listAll(listRef)
    .then((pics) => {
      productPictures = pics.items.map((item) => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${item._location.bucket}/o/${item._location.path_}?alt=media`;
        return {
          url: publicUrl,
          name: item._location.path_,
        };
      });
      res.send(productPictures);
    })
    .catch((error) => console.log(error.message));
});

router.delete('/delete', async (req, res) => {
  const deletePic = req.body.name;

  const deleteRef = ref(storage, deletePic);
  await deleteObject(deleteRef)
    .then(() => {
      res.send('deleted');
    })
    .catch((error) => console.log(error.message));
});

export const deleteFirebaseImg = async (imageName) => {
  const deleteRef = ref(storage, imageName);
  await deleteObject(deleteRef)
    .then(() => {
      res.send('deleted');
    })
    .catch((error) => console.log(error.message));
};

export default router;
