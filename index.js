import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userController from './controllers/users.js';
import contentController from './controllers/content.js';
import ratingsController from './controllers/user_rating.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/', userController);
app.use('/', contentController);
app.use('/', ratingsController);

app.listen(port, () => console.log(`listening on port ${port}`));
