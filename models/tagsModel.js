import { db } from '../config/dbConfig.js';
import { execQuery } from '../utils/dbUtil.js';

export const getAllTagsMdl = cb => {
  const qry = `
    SELECT id, name
      FROM tag
     ORDER BY name
  `;
  execQuery(db, qry, cb);
};