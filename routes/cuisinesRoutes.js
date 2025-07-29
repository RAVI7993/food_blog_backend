// File: src/routes/cuisinesRoutes.js
import express from 'express';
import { getAllCuisinesCtrl } from '../controllers/cuisinesController.js';
const router = express.Router();
router.get('/', getAllCuisinesCtrl);
export default router;
