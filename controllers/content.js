const express = require('express');
const app = express.Router();
const pool = require('./pool.js');

app.post('/getContent', async (req, res) => {
  try {
    const { user_id, content_type, title, filter } = req.body;

    let query = `SELECT content.id, content.title, content.image_url, content.content_type, 
    ${user_id ? 'user_ratings.rating' : 'content.rating'} AS rating FROM content`;

    const queryParams = [];
    if (user_id) {
      query +=
        ' JOIN user_ratings ON content.id = user_ratings.content_id AND user_ratings.user_id = $1';
      queryParams.push(user_id);
    }

    let where = '';
    if (content_type) {
      where += where.length ? ' AND' : ' WHERE';
      where += ` content.content_type = $${queryParams.length + 1}`;
      queryParams.push(content_type);
    }

    if (title) {
      where += where.length ? ' AND' : ' WHERE';
      where += ` content.title ILIKE $${queryParams.length + 1}`;
      queryParams.push(`%${title}%`);
    }

    query += where;
    query += filter ? ` ORDER BY ${filter}` : ' ORDER BY content.created_at ASC';
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
