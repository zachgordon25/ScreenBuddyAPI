const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const userController = require('./controllers/users.js');
const contentController = require('./controllers/content.js');
const ratingsController = require('./controllers/user_rating.js');

app.use('/', userController);
app.use('/', contentController);
app.use('/', ratingsController);

app.listen(port, () => console.log(`listening on port ${port}`));
