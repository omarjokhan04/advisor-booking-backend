const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Advisor Booking Backend API is running");
});

const pool = require("./db");

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({ ok: true, time: result.rows[0].current_time });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, message: "DB connection failed" });
  }
});

const pool = require("./db");

app.get("/tables", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    res.json(result.rows);
  } catch (err) {
    console.log("DB ERROR:", err.message);
    res.status(500).json({ ok: false, message: err.message });
  }
});



app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
