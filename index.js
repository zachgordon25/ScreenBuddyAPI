const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const userController = require('./controllers/users.js');
const contentController = require('./controllers/content.js');
const contentController2 = require('./controllers/content2.js');

app.use('/', userController);
app.use('/getContent', contentController);
app.use('/getContent2', contentController2);

app.get('/test', (req, res) => {
  res.send(req.body);
});

app.listen(port, () => console.log(`listening on port ${port}`));
