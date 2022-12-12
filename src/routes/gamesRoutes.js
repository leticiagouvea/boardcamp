import { Router } from 'express';
import { createGame, getGames } from '../controllers/gamesController.js';
import { validateGame } from '../middlewares/joiMiddlewares.js';

const router = Router();
router
  .post('/games', validateGame, createGame)
  .get('/games', getGames);

export default router;