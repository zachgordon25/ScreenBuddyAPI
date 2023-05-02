const { Router } = require('express');
const pool = require('./pool.js');
const app = Router();

const buildQuery = ({ user_id, content_type, title, filter, page }) => {
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

  const pageNum = (page - 1) * 20;
  query += ` OFFSET ${pageNum}`;

  return { query, queryParams };
};

app.post('/getContent', async (req, res) => {
  try {
    const page = req.query.page || 1;

    const { query, queryParams } = buildQuery({ ...req.body, page });

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

app.get('/getPageCount', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) / 20 FROM content');
    const numPages = parseInt(Object.values(rows[0])[0]);

    res.status(200).json({
      pages: numPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error: cannot get page count',
      error: err,
    });
  }
});

module.exports = app;
