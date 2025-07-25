// File: controllers/postsController.js

import {
  createPostMdl,
  getUserPostsMdl,
  deletePostMdl
} from '../models/postsModel.js';

/**
 * Creates a new post. Expects in req.body:
 *   - userId
 *   - title
 *   - content
 *   - (optional) videoUrl
 */
export const createPostCtrl = (req, res) => {
  const { userId, title, content, videoUrl } = req.body;
  if (!userId || !title || !content) {
    return res
      .status(400)
      .json({ status:400, message:'userId, title and content are required' });
  }

  createPostMdl({ userId, title, content, videoUrl }, (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status:500, message:'Failed to create post' });
    }
    res
      .status(201)
      .json({ status:201, message:'Post created', postId: result.insertId });
  });
};

/**
 * Fetches all posts for a given user.
 * Expects userId in req.query.userId
 */
export const getUserPostsCtrl = (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res
      .status(400)
      .json({ status:400, message:'userId query parameter is required' });
  }

  getUserPostsMdl(userId, (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status:500, message:'Failed to fetch posts' });
    }
    res.json({ status:200, results });
  });
};

/**
 * Deletes a single post.
 * Expects postId in req.params.id and userId in req.body.userId
 */
export const deletePostCtrl = (req, res) => {
  const postId = req.params.id;
  const userId = req.body.userId;
  if (!userId) {
    return res
      .status(400)
      .json({ status:400, message:'userId is required in request body' });
  }

  // Optionally, you could verify ownership here by querying the post first
  deletePostMdl(postId, err => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status:500, message:'Failed to delete post' });
    }
    res.json({ status:200, message:'Post deleted' });
  });
};
