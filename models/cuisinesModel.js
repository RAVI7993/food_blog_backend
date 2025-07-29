import { db } from '../config/dbConfig.js';
import { execQuery } from '../utils/dbUtil.js';

export const getAllCuisinesMdl = cb => {
  const qry = `
    SELECT id, name
      FROM cuisine
     ORDER BY name
  `;
  execQuery(db, qry, cb);
};