const express = require('express');
const app = express.Router();
const pool = require('./pool.js');

/**
CREATE TABLE user_ratings (
   rating_id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    content_id INT,
    title VARCHAR(255),
    image_url VARCHAR(255),
    rating DOUBLE PRECISION,
    content_type VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
     */

app.post('/addUserRating', (req, res) => {
  try {
    const { user_id, id, title, poster_path, vote_average, content_type } = req.body;
    pool.query(
      'INSERT INTO user_ratings (user_id, content_id, title, image_url, rating, content_type) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        user_id,
        id,
        title,
        `https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`,
        vote_average,
        content_type,
      ]
    );
    res.status(201).send('Success');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = app;
