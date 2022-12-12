import httpStatus from 'http-status';
import { connectionDB } from '../database/db.js';

export async function createCustomers(req, res) {
  const { name, phone, cpf, birthday } = res.locals.user;

  try {
    const customersExists = await connectionDB.query(`
      SELECT
        *
      FROM
        customers
      WHERE
        cpf
      ILIKE $1;`, [cpf]);

      if(customersExists.rowCount > 0) {
        return res.sendStatus(httpStatus.CONFLICT);
      }

      await connectionDB.query(`
        INSERT INTO
          customers (name, phone, cpf, birthday)
        VALUES
          ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);

      res.sendStatus(httpStatus.CREATED);

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
};