// File: routes/postsRoutes.js
import express from 'express';
import {
  createPostCtrl,
  getUserPostsCtrl,
  deletePostCtrl
} from '../controllers/postsController.js';

const router = express.Router();

// No authentication middleware applied here

router.post('/create', createPostCtrl);
router.get('/mine',    getUserPostsCtrl);
router.delete('/:id',   deletePostCtrl);

export default router;
