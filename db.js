const { Pool } = require("pg");

// ✅ No env variables (instructor rule) — put your local DB info here
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "advisor_booking",
  password: "0000",
  port: 5432,
});

module.exports = pool;
