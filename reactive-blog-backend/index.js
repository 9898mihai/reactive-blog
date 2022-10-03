import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import {
  loginValidation,
  registerValidation,
  postCreateValidation,
} from './validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';

import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect(
    'mongodb+srv://mongouser:mongopassword@cluster0.6gsww4w.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => console.log('db OK'))
  .catch((err) => console.log('DB error', err));

const app = express();
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('hello!');
});

app.post(
  '/auth/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post(
  '/auth/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  postCreateValidation,
  checkAuth,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('server OK');
});
