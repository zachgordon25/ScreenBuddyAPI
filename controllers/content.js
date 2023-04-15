const express = require('express');
const app = express.Router();
const Pool = require('pg').Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/', (req, res) => {
  pool.query('SELECT * FROM content', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

app.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('SELECT * FROM content WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

app.get('/type/:type', (req, res) => {
  const type = req.params.type;
  pool.query('SELECT * FROM content WHERE type = $1', [type], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

app.post('/', (req, res) => {
  const { type, name, image_url, total_ratings, average_rating } = req.body;
  pool.query(
    'INSERT INTO content (type, name, image_url, total_ratings, average_rating) VALUES ($1, $2, $3, $4, $5)',
    [type, name, image_url, total_ratings, average_rating],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send('Success');
    }
  );
});

app.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { type, name, image_url, total_ratings, average_rating } = req.body;
  pool.query(
    'UPDATE content SET type = $1, name = $2, image_url = $3, total_ratings = $4, average_rating = $5, updated_at = NOW() WHERE id = $6',
    [type, name, image_url, total_ratings, average_rating, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`Content modified with ID: ${id}`);
    }
  );
});

app.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  pool.query('DELETE FROM content WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Content deleted with ID: ${id}`);
  });
});

module.exports = app;
