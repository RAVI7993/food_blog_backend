// File: src/routes/tagsRoutes.js
import express from 'express';
import { getAllTagsCtrl } from '../controllers/tagsController.js';
const router = express.Router();
router.get('/', getAllTagsCtrl);
export default router;
