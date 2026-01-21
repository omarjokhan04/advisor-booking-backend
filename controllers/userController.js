const pool = require("../db");

// GET /users/advisors
exports.getAdvisors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT user_id, full_name, email
       FROM users
       WHERE role = 'advisor'
       ORDER BY full_name ASC`
    );

    res.json(result.rows);
  } catch (err) {
    console.log("USER ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
