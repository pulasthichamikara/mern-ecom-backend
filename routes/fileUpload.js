import express from 'express';
import multer from 'multer';
const router = express.Router();
import path from 'path';
/* const upload = multer({ dest: 'comuploads/' });
router.post('/', upload.single('image'), function (req, res, next) {
  
  console.log('req-->', req.file, 'body-->', req.body);
}); */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const checkFileType = (file, cb) => {
  const fileTypes = /jpg|jpeg|png|svg|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('only jpg, jpeg, png, svg files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
router.post('/', upload.single('image'), function (req, res) {
  res.send(`/${req.file.path}`);
});

export default router;
