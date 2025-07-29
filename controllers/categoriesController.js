// File: src/controllers/categoriesController.js
import { getAllCategoriesMdl } from '../models/categoriesModel.js';

export const getAllCategoriesCtrl = (req, res) => {
  getAllCategoriesMdl((err, rows) => {
    if (err) {
      console.error('getAllCategoriesMdl error:', err);
      return res
        .status(500)
        .json({ status: 500, message: 'Failed to fetch categories' });
    }
    res.json({ status: 200, results: rows });
  });
};
