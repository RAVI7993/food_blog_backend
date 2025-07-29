// File: src/routes/categoriesRoutes.js
import express from 'express';
import { getAllCategoriesCtrl } from '../controllers/categoriesController.js';

const router = express.Router();

// GET /food_blog/categories
router.get('/', getAllCategoriesCtrl);

export default router;
