import { Router } from 'express';
import { createCustomers, getCustomers, getCustomersId, updateCustomer } from '../controllers/customersControllers.js';
import { validateCustomer } from '../middlewares/joiMiddlewares.js';

const router = Router();
router
  .post('/customers', validateCustomer, createCustomers)
  .get('/customers', getCustomers)
  .get('/customers/:id', getCustomersId)
  .put('/customers/:id', validateCustomer, updateCustomer);

export default router;