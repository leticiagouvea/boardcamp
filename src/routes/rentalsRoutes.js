import { Router } from 'express';
import { createRental, getRentals } from '../controllers/rentalsControllers.js';
import { validateRental } from '../middlewares/joiMiddlewares.js';

const router = Router();
router
  .post('/rentals', validateRental, createRental)
  .get('/rentals', getRentals);

export default router;