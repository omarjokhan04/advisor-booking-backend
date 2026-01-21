const pool = require("../db");

// GET /slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { advisorId, date } = req.query;

    let sql = `
      SELECT s.slot_id, s.advisor_id, u.full_name AS advisor_name,
             s.slot_date, s.slot_time, s.location, s.status
      FROM advisor_slots s
      JOIN users u ON u.user_id = s.advisor_id
      WHERE s.status = 'Available'
    `;

    const params = [];
    let index = 1;

    if (advisorId) {
      sql += ` AND s.advisor_id = $${index++}`;
      params.push(advisorId);
    }

    if (date) {
      sql += ` AND s.slot_date = $${index++}`;
      params.push(date);
    }

    sql += ` ORDER BY s.slot_date, s.slot_time`;

    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.log("SLOT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /slots
exports.createSlot = async (req, res) => {
  try {
    const { advisor_id, slot_date, slot_time, location } = req.body;

    if (!advisor_id || !slot_date || !slot_time) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const result = await pool.query(
      `INSERT INTO advisor_slots (advisor_id, slot_date, slot_time, location)
       VALUES ($1,$2,$3,COALESCE($4,'Advising Office'))
       RETURNING *`,
      [advisor_id, slot_date, slot_time, location]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Slot already exists" });
    }
    console.log("SLOT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /slots/:id
exports.deleteSlot = async (req, res) => {
  try {
    const slotId = req.params.id;

    const result = await pool.query(
      `DELETE FROM advisor_slots
       WHERE slot_id = $1 AND status = 'Available'
       RETURNING slot_id`,
      [slotId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Cannot delete this slot" });
    }

    res.json({ message: "Slot deleted" });
  } catch (err) {
    console.log("SLOT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
