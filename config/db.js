// config/db.js
const { Pool } = require("pg");
require("dotenv").config();

console.log("connect with db");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
