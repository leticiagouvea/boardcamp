import { Router } from 'express';
import { createCategory } from '../controllers/categoriesController.js';
import { validateCategory } from '../middlewares/joiMiddlewares.js';

const router = Router();
router
  .post('/categories', validateCategory, createCategory);
/*.get('/categories', readCategory); */

export default router;