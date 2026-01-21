const express = require("express");
const cors = require("cors");

const pool = require("./db");

const authRoutes = require("./routes/authRoutes");
const slotRoutes = require("./routes/slotRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
const PORT = 5000;

// =========================
// Middlewares
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Basic Routes (quick checks)
// =========================
app.get("/", (req, res) => {
  res.send("Advisor Booking Backend API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// (Optional) DB quick test
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({ ok: true, time: result.rows[0].current_time });
  } catch (err) {
    console.log("DB ERROR:", err.message);
    res.status(500).json({ ok: false, message: err.message });
  }
});

// (Optional) Show tables
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

// =========================
// API Routes
// =========================
app.use("/auth", authRoutes);
app.use("/slots", slotRoutes);
app.use("/appointments", appointmentRoutes);

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
