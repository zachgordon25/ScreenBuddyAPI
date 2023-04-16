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

app.post('/', async (req, res) => {
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

module.exports = app;
