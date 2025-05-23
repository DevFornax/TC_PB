const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully!");
    client.release();
  } catch (err) {
    console.error("Database connection failed:", err.message, err.stack);
  }
}

module.exports = { pool, testConnection };
