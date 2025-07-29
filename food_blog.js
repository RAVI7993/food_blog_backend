// File: food_blog.js

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './config/dbConfig.js';

import autenticationRoute from './routes/authenticationRoutes.js';
import postsRoute        from './routes/postsRoutes.js';
import favoritesRoute    from './routes/favoritesRoutes.js';
import categoriesRoute   from './routes/categoriesRoutes.js';
import cuisinesRoute     from './routes/cuisinesRoutes.js';
import tagsRoute         from './routes/tagsRoutes.js';
import dietaryTagsRoute  from './routes/dietaryTagsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(cors());

// Serve uploaded images out of /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Body parsing with increased limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Fallback CORS headers for preflight
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin',  '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH');
    return res.status(200).json({});
  }
  next();
});

// Simple contact endpoint
app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  const sql = 'INSERT INTO ContactUs (name, email_id, message) VALUES (?, ?, ?)';
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error inserting into ContactUs table:', err);
      return res.status(500).json({ status: 500, message: 'Failed to insert into ContactUs table' });
    }
    res.status(200).json({ status: 200, message: 'Contact details inserted successfully' });
  });
});

// Public profile endpoint taking userId from querystring
app.get('/food_blog/autenticate/profile', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: 'userId query parameter is required' });
  }

  const sql = `
    SELECT
      id,
      user_name  AS userName,
      first_name AS firstName,
      last_name  AS lastName,
      email,
      address,
      mobile_no  AS mobileNo,
      created_at,
      updated_at
    FROM user
    WHERE id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res
        .status(500)
        .json({ status: 500, message: 'Failed to fetch user profile' });
    }
    if (!results.length) {
      return res
        .status(404)
        .json({ status: 404, message: 'User not found' });
    }
    res.json({ status: 200, result: results[0] });
  });
});




// Mount your routes
app.use('/food_blog/autenticate', autenticationRoute);
app.use('/food_blog/posts',       postsRoute);
app.use('/food_blog/favorites',   favoritesRoute);
app.use('/food_blog/categories',  categoriesRoute);
app.use('/food_blog/cuisines',    cuisinesRoute);
app.use('/food_blog/tags',        tagsRoute);
app.use('/food_blog/dietary-tags', dietaryTagsRoute);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server connected to port ${PORT}`);
});
