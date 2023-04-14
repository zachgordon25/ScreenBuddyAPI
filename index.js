const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const contentController = require('./controllers/content.js');

app.get('/content', contentController.getContents);
app.get('/content/:id', contentController.getContentById);
app.get('/content/type/:type', contentController.getContentByType);
app.post('/content', contentController.createContent);
app.put('/content/:id', contentController.updateContent);
app.delete('/content/:id', contentController.deleteContent);

app.get('/test', (req, res) => {
  res.send(req.body);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
