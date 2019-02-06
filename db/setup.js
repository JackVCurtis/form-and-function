const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

console.log(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

const queryText =
  `CREATE TABLE IF NOT EXISTS
    accounts(
      id UUID PRIMARY KEY,
      email VARCHAR(128),
      password VARCHAR(128),
      name VARCHAR(128),
      created_date TIMESTAMP,
      modified_date TIMESTAMP
    )`;

pool.query(queryText)
  .then((res) => {
    console.log(res);
    pool.end();
  })
  .catch((err) => {
    console.log(err);
    pool.end();
  });