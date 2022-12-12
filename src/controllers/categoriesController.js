import { connectionDB } from '../database/db.js';
import httpStatus from 'http-status';

export async function createCategory(req, res) {
  const { name } = res.locals.category;

  try {
    const categories = await connectionDB.query(`
      SELECT
        *
      FROM
        categories;`);

    const categoriesExists = categories.rows.find(value => value.name.toLowerCase() === name.toLowerCase());

    if (categoriesExists) {
      return sendStatus(httpStatus.CONFLICT);
    }

    await connectionDB.query(`
    INSERT INTO
      categories (name)
    VALUES
      ($1);`, [name]);

    res.sendStatus(httpStatus.CREATED);
    
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
};