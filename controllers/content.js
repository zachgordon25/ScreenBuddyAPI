const express = require('express');
const app = express.Router();
const pool = require('./pool.js');

app.get('/getAllContent', async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM content ORDER BY id ASC');
    res.status(200).json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error: cannot get content',
      error: err,
    });
  }
});

app.post('/getContent', async (req, res) => {
  try {
    const { content_type, title } = req.body;
    let query = 'SELECT * FROM content WHERE';
    const queryParams = [];
    if (content_type && title) {
      query += ' content_type = $1 AND title ILIKE $2';
      queryParams.push(content_type, `%${title}%`);
    } else if (content_type) {
      query += ' content_type = $1';
      queryParams.push(content_type);
    } else if (title) {
      query += ' title ILIKE $1';
      queryParams.push(`%${title}%`);
    } else {
      res.status(400).json({ error: 'Please provide a content_type or title' });
      return;
    }
    const { rows } = await pool.query(query, queryParams);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error: content not found',
      error: err,
    });
  }
});

app.get('getContent/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query('SELECT * FROM content WHERE id = $1', [id]);
    res.status(200).json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/addContent', (req, res) => {
  try {
    const { id, title, name, poster_path, vote_average, media_type } = req.body;
    const contentTitle = media_type === 'movie' ? title : name;
    pool.query(
      'INSERT INTO content (id, title, image_url, rating, content_type) VALUES ($1, $2, $3, $4, $5)',
      [
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
    res.status(500).json({
      success: false,
      message: 'Error: content not added',
      error: err,
    });
  }
});

app.put('getContent/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { type, name, image_url, total_ratings, average_rating } = req.body;
    await pool.query(
      'UPDATE content SET type = $1, name = $2, image_url = $3, total_ratings = $4, average_rating = $5, updated_at = NOW() WHERE id = $6',
      [type, name, image_url, total_ratings, average_rating, id]
    );
    res.status(200).send(`Content modified with ID: ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.delete('getContent/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await pool.query('DELETE FROM content WHERE id = $1', [id]);
    res.status(200).send(`Content deleted with ID: ${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = app;
