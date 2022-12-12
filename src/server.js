import express from 'express';
import cors from 'cors';
import categoriesRoutes from './routes/categoriesRoutes.js';
import dotenv from 'dotenv';
dotenv.config();
import { PORT } from './configs/constants.js';

const app = express();
app
  .use(express.json())
  .use(cors())
  .use(categoriesRoutes);

app.listen(PORT, () => console.log(`Server running in port: ${PORT}`));