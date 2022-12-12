import { Router } from 'express';
import { createGame } from '../controllers/gamesController.js';
import { validateGame } from '../middlewares/joiMiddlewares.js';

const router = Router();
router
  .post('/games', validateGame, createGame)
/*   .get('/games', getGame); */

export default router;