import { Router } from 'express';
import { createCustomers, getCustomers } from '../controllers/customersControllers.js';
import { validateCustomer } from '../middlewares/joiMiddlewares.js';

const router = Router();
router
  .post('/customers', validateCustomer, createCustomers)
  .get('/customers', getCustomers);

export default router;