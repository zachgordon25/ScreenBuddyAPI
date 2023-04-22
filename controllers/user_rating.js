const express = require('express');
const app = express.Router();
const pool = require('./pool.js');

app.post('/addUserRating', (req, res) => {
  try {
    const { user_id, id, title, name, poster_path, vote_average, media_type } = req.body;
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
    res.status(201).send({
      success: true,
      message: 'User rating added successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error: rating not added',
    });
  }
});

app.put('/updateUserRating', async (req, res) => {
  try {
    const { rating, user_id, content_id } = req.body;
    pool.query(
      'UPDATE user_ratings SET rating = $1, updated_at = NOW() WHERE user_id = $2 AND content_id = $3',
      [rating, user_id, content_id]
    );
    res.status(201).send({
      success: true,
      message: 'User rating updated successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error: rating not updated',
    });
  }
});

module.exports = app;
