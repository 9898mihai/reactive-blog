import express from 'express';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';

import mongoose from 'mongoose';

import {
  loginValidation,
  registerValidation,
  postCreateValidation,
} from './validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';

import {
  UserController,
  PostController,
  CommentController,
} from './controllers/index.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('db OK'))
  .catch((err) => console.log('DB error', err));

const app = express();
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
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
  res.send('Backend is Live!!!');
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
app.patch('/update/me', checkAuth, UserController.updateMe);
app.get('/profile/:id', UserController.getUser);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/best-posts', PostController.getPopular);
app.get('/posts/tags', PostController.getLastTags);
app.get('/tags', PostController.getLastTags);
app.get('/tags/:tag', PostController.getPostsByTag);
app.get('/posts/:id', PostController.getOne);
app.post('/posts/:id/comment', checkAuth, CommentController.addComment);
app.delete(
  '/comments/:postId/:commentId',
  checkAuth,
  CommentController.removeComment
);
app.get('/comments', CommentController.getLastComments);
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
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('server OK');
});
