import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { PORT } from './configs/constants.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import gamesRoutes from './routes/gamesRoutes.js';
import customersRoutes from './routes/customersRoutes.js';

const app = express();
app
  .use(express.json())
  .use(cors())
  .use(categoriesRoutes)
  .use(gamesRoutes)
  .use(customersRoutes)

app.listen(PORT, () => console.log(`Server running in port: ${PORT}`));