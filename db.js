const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err) => {

  if (err) {
    console.log('DATABASE CONNECTION ERROR');
    console.log(err.message);
  } else {
    console.log('DATABASE CONNECTED SUCCESSFULLY');
  }

});

module.exports = pool;