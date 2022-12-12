import { Router } from 'express';
import { createFinishedRental, createRental, deleteRental, getRentals } from '../controllers/rentalsControllers.js';
import { validateRental } from '../middlewares/joiMiddlewares.js';

const router = Router();
router
  .post('/rentals', validateRental, createRental)
  .get('/rentals', getRentals)
  .post('/rentals/:id/return', createFinishedRental)
  .delete('/rentals/:id', deleteRental);

export default router;