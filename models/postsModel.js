// File: src/models/postsModel.js

import { db } from '../config/dbConfig.js';
import { execQuery } from '../utils/dbUtil.js';

/**
 * Convert an ISO timestamp (e.g. "2025-07-28T21:17:00.000Z") into
 * MySQL’s DATETIME format "YYYY-MM-DD HH:MM:SS"
 */
function isoToMySQL(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
         ` ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Fetch all posts for a given user, including category & cuisine names.
 */
export const getUserPostsMdl = (userId, cb) => {
  const qry = `
    SELECT
      p.id,
      p.user_id,
      p.title,
      p.slug,
      p.excerpt,
      c.name    AS category,
      cu.name   AS cuisine,
      p.prep_time_min,
      p.cook_time_min,
      p.servings,
      p.difficulty,
      p.nutrition_cal,
      p.nutrition_pro,
      p.nutrition_fat,
      p.nutrition_carbs,
      p.publish_date,
      p.featured_image,
      p.video_url,
      p.meta_title,
      p.meta_description,
      p.created_at,
      p.updated_at
    FROM posts p
    LEFT JOIN category c ON p.category_id = c.id
    LEFT JOIN cuisine cu  ON p.cuisine_id  = cu.id
    WHERE p.user_id = ?
    ORDER BY p.publish_date DESC
  `;
  execQuery(db, qry, [userId], cb);
};

/**
 * Fetch a single post by its ID.
 */
export const getPostByIdMdl = (postId, cb) => {
  const qry = `
    SELECT *
      FROM posts
     WHERE id = ?
  `;
  execQuery(db, qry, [postId], cb);
};

/**
 * Create a new post with all advanced fields.
 * Accepts publishDate as ISO string and converts it for MySQL.
 */
export const createPostMdl = (postData, cb) => {
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
    nutrition: { calories, protein, fat, carbs } = {},
    publishDate,
    featuredImage,
    videoUrl,
    metaTitle,
    metaDescription
  } = postData;

  // Convert ISO -> MySQL DATETIME (or null)
  const mysqlDate = publishDate ? isoToMySQL(publishDate) : null;

  const qry = `
    INSERT INTO posts (
      user_id,
      title,
      slug,
      excerpt,
      category_id,
      cuisine_id,
      prep_time_min,
      cook_time_min,
      servings,
      difficulty,
      nutrition_cal,
      nutrition_pro,
      nutrition_fat,
      nutrition_carbs,
      publish_date,
      featured_image,
      video_url,
      meta_title,
      meta_description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    userId,
    title,
    slug,
    excerpt,
    categoryId || null,
    cuisineId  || null,
    prepTime,
    cookTime,
    servings,
    difficulty,
    calories   || null,
    protein    || null,
    fat        || null,
    carbs      || null,
    mysqlDate,
    featuredImage || null,
    videoUrl      || null,
    metaTitle     || null,
    metaDescription || null
  ];

  execQuery(db, qry, params, cb);
};

/**
 * Update an existing post by its ID.
 * Accepts publishDate as ISO string and converts it for MySQL.
 */
export const updatePostMdl = (postId, postData, cb) => {
  const {
    title,
    slug,
    excerpt,
    categoryId,
    cuisineId,
    prepTime,
    cookTime,
    servings,
    difficulty,
    nutrition: { calories, protein, fat, carbs } = {},
    publishDate,
    featuredImage,
    videoUrl,
    metaTitle,
    metaDescription
  } = postData;

  const mysqlDate = publishDate ? isoToMySQL(publishDate) : null;

  const qry = `
    UPDATE posts SET
      title            = ?,
      slug             = ?,
      excerpt          = ?,
      category_id      = ?,
      cuisine_id       = ?,
      prep_time_min    = ?,
      cook_time_min    = ?,
      servings         = ?,
      difficulty       = ?,
      nutrition_cal    = ?,
      nutrition_pro    = ?,
      nutrition_fat    = ?,
      nutrition_carbs  = ?,
      publish_date     = ?,
      featured_image   = ?,
      video_url        = ?,
      meta_title       = ?,
      meta_description = ?
    WHERE id = ?
  `;
  const params = [
    title,
    slug,
    excerpt,
    categoryId || null,
    cuisineId  || null,
    prepTime,
    cookTime,
    servings,
    difficulty,
    calories   || null,
    protein    || null,
    fat        || null,
    carbs      || null,
    mysqlDate,
    featuredImage || null,
    videoUrl      || null,
    metaTitle     || null,
    metaDescription || null,
    postId
  ];

  execQuery(db, qry, params, cb);
};

/**
 * Delete a post by its ID.
 */
export const deletePostMdl = (postId, cb) => {
  const qry = `DELETE FROM posts WHERE id = ?`;
  execQuery(db, qry, [postId], cb);
};

/**
 * Insert ingredients for a post, preserving order.
 * Expects ingredients = array of strings.
 */
export const addIngredientsMdl = (postId, ingredients, cb) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return cb(null, { affectedRows: 0 });
  }
  const qry = `
    INSERT INTO post_ingredients (post_id, position, text)
    VALUES ?
  `;
  const values = ingredients.map((text, idx) => [postId, idx + 1, text]);
  execQuery(db, qry, [values], cb);
};

/**
 * Insert steps for a post, preserving order.
 * Expects steps = array of strings.
 */
export const addStepsMdl = (postId, steps, cb) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return cb(null, { affectedRows: 0 });
  }
  const qry = `
    INSERT INTO post_steps (post_id, position, text)
    VALUES ?
  `;
  const values = steps.map((text, idx) => [postId, idx + 1, text]);
  execQuery(db, qry, [values], cb);
};

export const getAllPostsMdl = (limit, cb) => {
  const qry = `
    SELECT
      p.id,
      p.title,
      p.slug,
      p.excerpt,
      p.featured_image,
      c.name  AS category,
      cu.name AS cuisine
    FROM posts p
    LEFT JOIN category c ON p.category_id = c.id
    LEFT JOIN cuisine  cu ON p.cuisine_id  = cu.id
    ORDER BY p.publish_date DESC
    LIMIT ?
  `;
  execQuery(db, qry, [limit], cb);
};