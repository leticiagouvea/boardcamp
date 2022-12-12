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

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;
  
  try {
    if (customerId) {
      const customer = await connectionDB.query(`
          SELECT
            *
          FROM
            customers
          WHERE
            id = $1;`, [customerId]);

      if (customer.rowCount === 0) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }

      const rentals = await connectionDB.query(`
        SELECT
          rentals.*,
          customers.id AS "customer.id",
          customers.name AS "customer.name",
          games.id AS "game.id",
          games.name AS "game.name",
          games."categoryId" AS "game.categoryId",
          categories.name AS "game.categoryName"
        FROM
          rentals
          JOIN customers ON rentals."customerId" = customers.id
          JOIN games ON rentals."gameId" = games.id
          JOIN categories ON games."categoryId" = categories.id
        WHERE
          rentals."customerId" = $1;`, [customerId]);

      const result = rentals?.rows.map(value => ({
        id: value.id,
        customerId: value.customerId,
        gameId: value.gameId,
        rentDate: value.rentDate,
        daysRented: value.daysRented,
        returnDate: value.returnDate,
        originalPrice: value.originalPrice,
        delayFee: value.delayFee,
        customer: {
          id: value['customer.id'],
          name: value['customer.name']
        },
        game: {
          id: value['game.id'],
          name: value['game.name'],
          categoryId: value['game.categoryId'],
          categoryName: value['game.categoryName']
        }
        }));

      return res.send(result); 
    }

    if (gameId) {
      const game = await connectionDB.query(`
          SELECT
            *
          FROM
            games
          WHERE
            id = $1;`, [gameId]);

      if (game.rowCount === 0) {
        return res.sendStatus(httpStatus.NOT_FOUND);
      }

      const rentals = await connectionDB.query(`
        SELECT
          rentals.*,
          customers.id AS "customer.id",
          customers.name AS "customer.name",
          games.id AS "game.id",
          games.name AS "game.name",
          games."categoryId" AS "game.categoryId",
          categories.name AS "game.categoryName"
        FROM
          rentals
          JOIN customers ON rentals."customerId" = customers.id
          JOIN games ON rentals."gameId" = games.id
          JOIN categories ON games."categoryId" = categories.id
        WHERE
          rentals."gameId" = $1;`, [gameId]);

      const result = rentals?.rows.map(value => ({
        id: value.id,
        customerId: value.customerId,
        gameId: value.gameId,
        rentDate: value.rentDate,
        daysRented: value.daysRented,
        returnDate: value.returnDate,
        originalPrice: value.originalPrice,
        delayFee: value.delayFee,
        customer: {
          id: value['customer.id'],
          name: value['customer.name']
        },
        game: {
          id: value['game.id'],
          name: value['game.name'],
          categoryId: value['game.categoryId'],
          categoryName: value['game.categoryName']
        }
      }));

      return res.send(result); 
    }

    const rentals = await connectionDB.query(`
      SELECT
        rentals.*,
        customers.id AS "customer.id",
        customers.name AS "customer.name",
        games.id AS "game.id",
        games.name AS "game.name",
        games."categoryId" AS "game.categoryId",
        categories.name AS "game.categoryName"
      FROM
        rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
        JOIN categories ON games."categoryId" = categories.id;`);
    
      const result = rentals?.rows.map(value => ({
        id: value.id,
        customerId: value.customerId,
        gameId: value.gameId,
        rentDate: value.rentDate,
        daysRented: value.daysRented,
        returnDate: value.returnDate,
        originalPrice: value.originalPrice,
        delayFee: value.delayFee,
        customer: {
          id: value['customer.id'],
          name: value['customer.name']
        },
        game: {
          id: value['game.id'],
          name: value['game.name'],
          categoryId: value['game.categoryId'],
          categoryName: value['game.categoryName']
        }
      }));

    res.send(result);

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
};