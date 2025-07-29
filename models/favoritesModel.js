// File: models/favoritesModel.js
import { db } from '../config/dbConfig.js';
import { execQuery } from '../utils/dbUtil.js';

/**
 * Get all favorite posts for a given user.
 */
export const getUserFavoritesMdl = (userId, cb) => {
  const qry = `
    SELECT p.*
      FROM posts p
      JOIN favorites f
        ON f.post_id = p.id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC
  `;
  execQuery(db, qry, [userId], cb);
};

/**
 * Add a new favorite.
 */
export const createFavoriteMdl = ({ userId, postId }, cb) => {
  const qry = `
    INSERT INTO favorites (user_id, post_id)
    VALUES (?, ?)
  `;
  execQuery(db, qry, [userId, postId], cb);
};

/**
 * Remove a favorite.
 */
export const deleteFavoriteMdl = ({ userId, postId }, cb) => {
  const qry = `
    DELETE FROM favorites
     WHERE user_id = ?
       AND post_id = ?
  `;
  execQuery(db, qry, [userId, postId], cb);
};
