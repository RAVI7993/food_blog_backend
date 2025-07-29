// File: src/routes/postsRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createPostCtrl,
  getUserPostsCtrl,
  getPostByIdCtrl,
  updatePostCtrl,
  deletePostCtrl,
  getAllPostsCtrl
} from '../controllers/postsController.js';

const router = express.Router();

// Configure where to store uploads and how to name them:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `post-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});

// Create post (multipart/form-data, single file field "featuredImage")
router.post(
  '/create',
  upload.single('featuredImage'),
  (req, res, next) => {
    // If an image was uploaded, attach its URL to req.body
    if (req.file) {
      req.body.featuredImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    next();
  },
  createPostCtrl
);

// Get all posts for homepage
router.get('/all', getAllPostsCtrl);

// Get user’s posts
router.get('/mine', getUserPostsCtrl);

// Get a single post by ID or slug
router.get('/:id', getPostByIdCtrl);

// Update post (also allow changing the image)
router.put(
  '/:id',
  upload.single('featuredImage'),
  (req, res, next) => {
    if (req.file) {
      req.body.featuredImage = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    next();
  },
  updatePostCtrl
);

// Delete
router.delete('/:id', deletePostCtrl);

export default router;
