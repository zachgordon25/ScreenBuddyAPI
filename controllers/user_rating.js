const express = require('express');
const app = express.Router();
const pool = require('./pool.js');

app.post('/addUserRating', (req, res) => {
  try {
    const { user_id, id, title, name, poster_path, vote_average, media_type } = req.body.results[4];
    const contentTitle = media_type === 'movie' ? title : name;
    pool.query(
      'INSERT INTO user_ratings (user_id, content_id, title, image_url, rating, content_type) VALUES ($1, $2, $3, $4, $5, $6)',
      [
        user_id,
        id,
        contentTitle,
        `https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`,
        vote_average,
        media_type,
      ]
    );
    res.status(201).send('Success');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = app;
