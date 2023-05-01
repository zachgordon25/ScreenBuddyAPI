const express = require('express');
const app = express.Router();
const pool = require('./pool.js');

const buildQuery = (user_id, content_type, title, filter) => {
  let query = `SELECT content.id, content.title, content.image_url, content.content_type, 
    ${user_id ? 'user_ratings.rating' : 'content.rating'} AS rating FROM content`;

  const queryParams = [];
  if (user_id) {
    query +=
      ' JOIN user_ratings ON content.id = user_ratings.content_id AND user_ratings.user_id = $1';
    queryParams.push(user_id);
  }

  let whereClause = '';

  if (content_type) {
    whereClause += whereClause.length ? ' AND' : ' WHERE';
    whereClause += ` content.content_type = $${queryParams.length + 1}`;
    queryParams.push(content_type);
  }

  if (title) {
    whereClause += whereClause.length ? ' AND' : ' WHERE';
    whereClause += ` content.title ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${title}%`);
  }

  query += whereClause;

  if (filter) {
    query += user_id ? ` ORDER BY user_ratings.${filter}` : ` ORDER BY content.${filter}`;
  } else {
    query += user_id
      ? ' ORDER BY user_ratings.updated_at DESC'
      : ' ORDER BY content.updated_at DESC';
  }
  query += user_id ? '' : ' LIMIT 20';
  return { query, queryParams };
};

app.post('/getContent', async (req, res) => {
  try {
    const { user_id, content_type, title, filter } = req.body;
    const { query, queryParams } = buildQuery(user_id, content_type, title, filter);

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

module.exports = app;
