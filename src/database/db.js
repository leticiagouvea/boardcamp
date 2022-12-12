import pkg from 'pg';
import { DATABASE_URL } from '../configs/constants.js';

const { Pool } = pkg;

export const connectionDB = new Pool({
  connectionString: DATABASE_URL
});