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

app.get('/getAllUserIds', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT user_id FROM users');
    const userIds = rows.map((row) => row.user_id);
    res.status(200).json(userIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/getUser', async (req, res) => {
  try {
    const { user_id, username } = req.body;
    let query = 'SELECT * FROM users WHERE';
    const queryParams = [];
    if (user_id && username) {
      query += ' user_id = $1 AND username = $2';
      queryParams.push(user_id, username);
    } else if (user_id) {
      query += ' user_id = $1';
      queryParams.push(user_id);
    } else if (username) {
      query += ' username = $1';
      queryParams.push(username);
    } else {
      res.status(400).json({ error: 'Please provide user_id or username' });
      return;
    }
    const { rows } = await pool.query(query, queryParams);
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/addUser', async (req, res) => {
  try {
    const { rows } = await pool.query('INSERT INTO users (user_id, username) VALUES ($1, $2)', [
      req.body.user_id,
      req.body.username,
    ]);
    res.status(200).json({
      success: true,
      message: 'User created successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = app;
