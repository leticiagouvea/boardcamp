import { Router } from 'express';
import { createRental } from '../controllers/rentalsControllers.js';
import { validateRental } from '../middlewares/joiMiddlewares.js';

const router = Router();
router
  .post('/rentals', validateRental, createRental);
  /* .get('/rentals', ); */

export default router;