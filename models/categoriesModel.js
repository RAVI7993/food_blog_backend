// File: src/models/categoriesModel.js
import { db } from '../config/dbConfig.js';
import { execQuery } from '../utils/dbUtil.js';

export const getAllCategoriesMdl = (cb) => {
  const qry = `
    SELECT id, name
      FROM category
     ORDER BY name
  `;
  execQuery(db, qry, cb);
};
