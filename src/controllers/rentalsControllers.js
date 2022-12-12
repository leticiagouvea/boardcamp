import { connectionDB } from '../database/db.js';
import dayjs from 'dayjs';
import httpStatus from 'http-status';

const date = dayjs().locale("pt-br").format("YYYY-MM-DD");

export async function createRental(req, res) {
  const { customerId, gameId, daysRented } = res.locals.rental;
  const returnDate = null;
  const delayFee = null;

  try {
    const customer = await connectionDB.query(`
      SELECT
        *
      FROM
        customers
      WHERE
        id = $1;`, [customerId]);

    if (customer.rowCount === 0) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const games = await connectionDB.query(`
      SELECT
        *
      FROM
        games;`);

    const gameAvailable = games.rows.find(value => value.id === gameId && value.stockTotal > 0)

    if(!gameAvailable) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const originalPrice = games.rows
      .filter(value => value.id === gameId)
      .map(value => value.pricePerDay * daysRented);
      
    const newStock = games.rows
      .filter(value => value.id === gameId)
      .map(value => value.stockTotal - 1);

    await connectionDB.query(`
      INSERT INTO
        rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES
        ($1, $2, $3, $4, $5, $6, $7);`,
        [customerId, gameId, date, daysRented, returnDate, Number(originalPrice), delayFee]);

    await connectionDB.query(`
      UPDATE
        games
      SET
        "stockTotal" = $1
      WHERE
        id = $2;`, [Number(newStock), gameId]);

    res.sendStatus(httpStatus.CREATED);

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
};