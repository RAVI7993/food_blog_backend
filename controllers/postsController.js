// File: src/controllers/postsController.js

import {
  createPostMdl,
  getUserPostsMdl,
  getPostByIdMdl,
  updatePostMdl,
  deletePostMdl,
  addIngredientsMdl,
  addStepsMdl,
  getAllPostsMdl
} from '../models/postsModel.js';

/**
 * Creates a new post (with optional ingredients & steps).
 */
export const createPostCtrl = (req, res) => {
  const {
    userId,
    title,
    slug,
    excerpt,
    categoryId,
    cuisineId,
    prepTime,
    cookTime,
    servings,
    difficulty,
    nutrition = {},
    publishDate,
    featuredImage,
    videoUrl,
    metaTitle,
    metaDescription,
    ingredients = [],
    steps = []
  } = req.body;

  if (!userId || !title || !slug || !excerpt) {
    return res.status(400).json({
      status: 400,
      message: 'userId, title, slug and excerpt are required'
    });
  }

  createPostMdl({
    userId,
    title,
    slug,
    excerpt,
    categoryId,
    cuisineId,
    prepTime,
    cookTime,
    servings,
    difficulty,
    nutrition,
    publishDate,
    featuredImage,
    videoUrl,
    metaTitle,
    metaDescription
  }, (err, result) => {
    if (err) {
      console.error('createPostMdl error:', err);
      return res.status(500).json({ status:500, message:'Failed to create post' });
    }
    const postId = result.insertId;
    addIngredientsMdl(postId, ingredients, ingErr => {
      if (ingErr) console.error('addIngredientsMdl error:', ingErr);
      addStepsMdl(postId, steps, stepErr => {
        if (stepErr) console.error('addStepsMdl error:', stepErr);
        res.status(201).json({ status:201, message:'Post created', postId });
      });
    });
  });
};

/**
 * Fetches all posts for a given user.
 */
export const getUserPostsCtrl = (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({
      status: 400,
      message: 'userId query parameter is required'
    });
  }
  getUserPostsMdl(userId, (err, results) => {
    if (err) {
      console.error('getUserPostsMdl error:', err);
      return res.status(500).json({ status:500, message:'Failed to fetch posts' });
    }
    res.json({ status:200, results });
  });
};

/**
 * Fetches a single post by its ID.
 */
export const getPostByIdCtrl = (req, res) => {
  const postId = req.params.id;
  getPostByIdMdl(postId, (err, rows) => {
    if (err) {
      console.error('getPostByIdMdl error:', err);
      return res.status(500).json({ status:500, message:'Failed to fetch post' });
    }
    if (!rows.length) {
      return res.status(404).json({ status:404, message:'Post not found' });
    }
    res.json({ status:200, result: rows[0] });
  });
};

/**
 * Updates an existing post by its ID.
 */
export const updatePostCtrl = (req, res) => {
  const postId = req.params.id;
  updatePostMdl(postId, req.body, (err, result) => {
    if (err) {
      console.error('updatePostMdl error:', err);
      return res.status(500).json({ status:500, message:'Failed to update post' });
    }
    res.json({ status:200, message:'Post updated' });
  });
};

/**
 * Deletes a single post.
 */
export const deletePostCtrl = (req, res) => {
  const postId = req.params.id;
  deletePostMdl(postId, err => {
    if (err) {
      console.error('deletePostMdl error:', err);
      return res.status(500).json({ status:500, message:'Failed to delete post' });
    }
    res.json({ status:200, message:'Post deleted' });
  });
};

export const getAllPostsCtrl = (req, res) => {
  const lim = parseInt(req.query.limit, 10) || 6;
  getAllPostsMdl(lim, (err, rows) => {
    if (err) {
      console.error('getAllPostsMdl error:', err);
      return res
        .status(500)
        .json({ status: 500, message: 'Failed to fetch posts' });
    }
    res.json({ status: 200, results: rows });
  });
};

