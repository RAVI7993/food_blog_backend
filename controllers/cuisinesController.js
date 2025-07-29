import { getAllCuisinesMdl } from '../models/cuisinesModel.js';

export const getAllCuisinesCtrl = (req, res) => {
  getAllCuisinesMdl((err, rows) => {
    if (err) {
      console.error('getAllCuisinesMdl error:', err);
      return res.status(500).json({ status:500, message:'Failed to fetch cuisines' });
    }
    res.json({ status:200, results: rows });
  });
};