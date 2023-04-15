const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const contentController = require('./controllers/content.js');
const userController = require('./controllers/users.js');

app.use('/getContent', contentController);
app.use('/getAllUserIds', userController);

app.get('/test', (req, res) => {
  res.send(req.body);
});

app.listen(port, () => console.log(`listening on port ${port}`));
