import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { PORT } from './configs/constants.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import gamesRoutes from './routes/gamesRoutes.js';

const app = express();
app
  .use(express.json())
  .use(cors())
  .use(categoriesRoutes)
  .use(gamesRoutes);

app.listen(PORT, () => console.log(`Server running in port: ${PORT}`));