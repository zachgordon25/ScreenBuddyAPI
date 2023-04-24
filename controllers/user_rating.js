const express = require('express');
const app = express.Router();
const pool = require('./pool.js');

app.post('/addUserRating', async (req, res) => {
  try {
    const { user_id, id, title, name, poster_path, vote_average, media_type } = req.body;
    const contentTitle = media_type === 'movie' ? title : name;

    const contentCheck = await pool.query('SELECT * FROM content WHERE id = $1', [id]);
    if (contentCheck.rows.length === 0) {
      await pool.query(
        'INSERT INTO content (id, title, image_url, rating, content_type) VALUES ($1, $2, $3, $4, $5)',
        [
          id,
          contentTitle,
          `https://image.tmdb.org/t/p/w600_and_h900_bestv2${poster_path}`,
          vote_average,
          media_type,
        ]
      );
    }

    await pool.query(
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
      error: err,
    });
  }
});

app.put('/updateUserRating', async (req, res) => {
  try {
    const { rating, user_id, content_id } = req.body;
    await pool.query(
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
      error: err,
    });
  }
});

app.delete('/deleteUserRating', async (req, res) => {
  try {
    const { user_id, content_id } = req.body;
    await pool.query('DELETE FROM user_ratings WHERE user_id = $1 AND content_id = $2', [
      user_id,
      content_id,
    ]);
    res.status(200).send({
      success: true,
      message: 'User rating deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error: rating not deleted',
      error: err,
    });
  }
});

module.exports = app;
