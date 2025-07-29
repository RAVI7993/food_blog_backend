// File: src/routes/dietaryTagsRoutes.js
import express from 'express';
import { getAllDietaryTagsCtrl } from '../controllers/dietaryTagsController.js';
const router = express.Router();
router.get('/', getAllDietaryTagsCtrl);
export default router;
