const bcrypt = require("bcrypt");
const pool = require("../db");

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }
    if (!["student", "advisor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1,$2,$3,$4)
       RETURNING user_id, full_name, email, role`,
      [full_name, email.toLowerCase(), password_hash, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.log("AUTH ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const result = await pool.query(
      `SELECT user_id, full_name, email, role, password_hash
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.log("AUTH ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
