import express from 'express';
import {
  getUserFavoritesCtrl,
  createFavoriteCtrl,
  deleteFavoriteCtrl
} from '../controllers/favoritesController.js';

const router = express.Router();

// Public: fetch a user’s favorites
router.get('/user', getUserFavoritesCtrl);

// Add a new favorite
router.post('/add', createFavoriteCtrl);

// Remove a favorite
router.delete('/remove', deleteFavoriteCtrl);

export default router;
