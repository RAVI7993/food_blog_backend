// File: src/controllers/tagsController.js
import { getAllTagsMdl } from '../models/tagsModel.js';

export const getAllTagsCtrl = (req, res) => {
  getAllTagsMdl((err, rows) => {
    if (err) {
      console.error('getAllTagsMdl error:', err);
      return res.status(500).json({ status:500, message:'Failed to fetch tags' });
    }
    res.json({ status:200, results: rows });
  });
};
