import { getAllDietaryTagsMdl } from '../models/dietaryTagsModel.js';

export const getAllDietaryTagsCtrl = (req, res) => {
  getAllDietaryTagsMdl((err, rows) => {
    if (err) {
      console.error('getAllDietaryTagsMdl error:', err);
      return res.status(500).json({ status:500, message:'Failed to fetch dietary tags' });
    }
    res.json({ status:200, results: rows });
  });
};