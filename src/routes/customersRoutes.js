import { Router } from 'express';
import { createCustomers } from '../controllers/customersControllers.js';
import { validateCustomer } from '../middlewares/joiMiddlewares.js';

const router = Router();
router
  .post('/customers', validateCustomer, createCustomers)
/*   .get('/customers', getGames); */

export default router;