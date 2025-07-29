import {
  getUserFavoritesMdl,
  createFavoriteMdl,
  deleteFavoriteMdl
} from '../models/favoritesModel.js';

export const getUserFavoritesCtrl = (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res
      .status(400)
      .json({ status:400, message:'userId query parameter is required' });
  }
  getUserFavoritesMdl(userId, (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status:500, message:'Failed to fetch favorites' });
    }
    res.json({ status:200, results });
  });
};

export const createFavoriteCtrl = (req, res) => {
  const { userId, postId } = req.body;
  if (!userId || !postId) {
    return res
      .status(400)
      .json({ status:400, message:'userId and postId are required' });
  }
  createFavoriteMdl({ userId, postId }, (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status:500, message:'Failed to add favorite' });
    }
    res
      .status(201)
      .json({ status:201, message:'Favorite added', favoriteId: result.insertId });
  });
};

export const deleteFavoriteCtrl = (req, res) => {
  const { userId, postId } = req.body;
  if (!userId || !postId) {
    return res
      .status(400)
      .json({ status:400, message:'userId and postId are required' });
  }
  deleteFavoriteMdl({ userId, postId }, err => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ status:500, message:'Failed to remove favorite' });
    }
    res.json({ status:200, message:'Favorite removed' });
  });
};
