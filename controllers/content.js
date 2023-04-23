const express = require('express');
const app = express.Router();
const pool = require('./pool.js');

app.get('/', async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM content ORDER BY id ASC');
    res.status(200).json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/get', async (req, res) => {
  try {
    const { type, name } = req.body;
    let query = 'SELECT * FROM content WHERE';
    const queryParams = [];
    if (type && name) {
      query += ' type = $1 AND name ILIKE $2';
      queryParams.push(type, `%${name}%`);
    } else if (type) {
      query += ' type = $1';
      queryParams.push(type);
    } else if (name) {
      query += ' name ILIKE $1';
      queryParams.push(`%${name}%`);
    } else {
      res.status(400).json({ error: 'Please provide a type or name' });
      return;
    }
    const { rows } = await pool.query(query, queryParams);
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query('SELECT * FROM content WHERE id = $1', [id]);
    res.status(200).json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/title/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const results = await pool.query('SELECT * FROM content WHERE name ILIKE $1 ORDER BY name', [
      `%${name}%`,
    ]);
    res.status(200).json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/type/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const results = await pool.query('SELECT * FROM content WHERE type = $1', [type]);
    res.status(200).json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/', (req, res) => {
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
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.put('/:id', async (req, res) => {
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

app.delete('/:id', async (req, res) => {
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
