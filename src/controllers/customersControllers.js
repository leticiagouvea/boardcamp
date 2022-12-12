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

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  try {
    if (!cpf) {
      const customers = await connectionDB.query(`
        SELECT
          *
        FROM
          customers;`);
      
      return res.send(customers.rows);
    }

    const customer = await connectionDB.query(`
      SELECT
        *
      FROM
        customers
      WHERE
        cpf
      LIKE $1;`, [`${cpf}%`]);

      if (customer.rowCount === 0) {
        res.sendStatus(httpStatus.NOT_FOUND);
      }

      res.send(customer.rows);

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
};

export async function getCustomersId(req, res) {
  const { id } = req.params;

  try {
    const customer = await connectionDB.query(`
      SELECT
        *
      FROM
        customers
      WHERE
        id = $1`, [Number(id)]);

    if (customer.rowCount === 0) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    res.send(customer.rows);

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
};

export async function updateCustomer(req, res) {
  const { name, phone, cpf, birthday } = res.locals.user;
  const { id } = req.params;

  try {
    const customerById = await connectionDB.query(`
      SELECT
        *
      FROM
        customers
      WHERE
        id = $1`, [Number(id)]);

    if (customerById.rowCount === 0) {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    const customersByCpf = await connectionDB.query(`
      SELECT
        *
      FROM
        customers
      WHERE
        cpf
      ILIKE $1;`, [cpf]);

    if (customersByCpf.rowCount > 0) {
      return res.sendStatus(httpStatus.CONFLICT);
    }

    await connectionDB.query(`
      UPDATE
        customers
      SET
        name = $1, phone = $2, cpf = $3, birthday = $4
      WHERE
        id = $5`, [name, phone, cpf, birthday, Number(id)]);

      res.sendStatus(httpStatus.OK);

  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
};