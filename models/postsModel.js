import { db } from '../config/dbConfig.js';
import { execQuery } from '../utils/dbUtil.js';

export const createPostMdl = ({ userId, title, content, videoUrl }, cb) => {
  const qry = `
    INSERT INTO posts (user_id, title, content, video_url)
    VALUES (?, ?, ?, ?)
  `;
  execQuery(db, qry, [userId, title, content, videoUrl || ''], cb);
};

export const getUserPostsMdl = (userId, cb) => {
  const qry = `
    SELECT * 
      FROM posts 
     WHERE user_id = ?
     ORDER BY created_at DESC
  `;
  execQuery(db, qry, [userId], cb);
};

export const deletePostMdl = (postId, cb) => {
  const qry = `DELETE FROM posts WHERE id = ?`;
  execQuery(db, qry, [postId], cb);
};
