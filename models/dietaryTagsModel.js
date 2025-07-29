import { db } from '../config/dbConfig.js';
import { execQuery } from '../utils/dbUtil.js';

export const getAllDietaryTagsMdl = cb => {
  const qry = `
    SELECT id, name
      FROM dietary_tag
     ORDER BY name
  `;
  execQuery(db, qry, cb);
};