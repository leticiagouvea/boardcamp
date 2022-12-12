import httpStatus from "http-status";
import { connectionDB } from "../database/db.js";

export async function createGame(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game;

  try {
    const categories = await connectionDB.query(`
      SELECT
        *
      FROM
        categories;`);

    const categoryIdExists = categories.rows.find(value => value.id === categoryId);

    if (!categoryIdExists) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const games = await connectionDB.query(`
      SELECT
        *
      FROM
        games;`);

    const gameExists = games.rows.find(value => value.name.toLowerCase() === name.toLowerCase());

    if (gameExists) {
      return res.sendStatus(httpStatus.CONFLICT);
    }

    await connectionDB.query(`
      INSERT INTO
        games (name, image, "stockTotal", "categoryId", "pricePerDay")
      VALUES
        ($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]);

    res.sendStatus(httpStatus.CREATED);

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
};