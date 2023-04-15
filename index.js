const express = require('express');
const app = express();
const bodyParser = require('body-parser');

require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const contentController = require('./controllers/content.js');

app.use('/content', contentController);

app.get('/test', (req, res) => {
  res.send(req.body);
});

app.listen(port, () => console.log(`listening on port ${port}`));
