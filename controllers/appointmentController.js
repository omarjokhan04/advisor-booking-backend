const pool = require("../db");

// POST /appointments
// body: { slot_id, student_id }
exports.bookAppointment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { slot_id, student_id } = req.body;

    if (!slot_id || !student_id) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await client.query("BEGIN");

    // 1) Lock slot row (prevent double booking)
    const slotRes = await client.query(
      `SELECT slot_id, advisor_id, slot_date, slot_time, location, status
       FROM advisor_slots
       WHERE slot_id = $1
       FOR UPDATE`,
      [slot_id]
    );

    if (slotRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Slot not found" });
    }

    const slot = slotRes.rows[0];

    if (slot.status !== "Available") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Slot is not available" });
    }

    // 2) Update slot status -> Booked
    await client.query(
      `UPDATE advisor_slots
       SET status = 'Booked'
       WHERE slot_id = $1`,
      [slot_id]
    );

    // 3) Create appointment
    const apptRes = await client.query(
      `INSERT INTO appointments (slot_id, student_id, advisor_id, status)
       VALUES ($1, $2, $3, 'Booked')
       RETURNING appointment_id, slot_id, student_id, advisor_id, status, booked_at`,
      [slot_id, student_id, slot.advisor_id]
    );

    await client.query("COMMIT");

    // Return helpful data for frontend email
    res.status(201).json({
      ...apptRes.rows[0],
      slot_date: slot.slot_date,
      slot_time: slot.slot_time,
      location: slot.location,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.log("APPOINTMENT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};

// GET /appointments/student/:id
exports.getStudentAppointments = async (req, res) => {
  try {
    const studentId = req.params.id;

    const result = await pool.query(
      `SELECT a.appointment_id, a.status, a.booked_at, a.completed_at,
              s.slot_date, s.slot_time, s.location,
              u.full_name AS advisor_name, a.advisor_id
       FROM appointments a
       JOIN advisor_slots s ON s.slot_id = a.slot_id
       JOIN users u ON u.user_id = a.advisor_id
       WHERE a.student_id = $1
       ORDER BY s.slot_date DESC, s.slot_time DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.log("APPOINTMENT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /appointments/advisor/:id
exports.getAdvisorAppointments = async (req, res) => {
  try {
    const advisorId = req.params.id;

    const result = await pool.query(
      `SELECT a.appointment_id, a.status, a.booked_at, a.completed_at,
              s.slot_date, s.slot_time, s.location,
              u.full_name AS student_name, a.student_id
       FROM appointments a
       JOIN advisor_slots s ON s.slot_id = a.slot_id
       JOIN users u ON u.user_id = a.student_id
       WHERE a.advisor_id = $1
       ORDER BY s.slot_date DESC, s.slot_time DESC`,
      [advisorId]
    );

    res.json(result.rows);
  } catch (err) {
    console.log("APPOINTMENT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /appointments/:id/complete
exports.completeAppointment = async (req, res) => {
  const client = await pool.connect();
  try {
    const appointmentId = req.params.id;

    await client.query("BEGIN");

    // Lock appointment
    const apptRes = await client.query(
      `SELECT appointment_id, slot_id, status
       FROM appointments
       WHERE appointment_id = $1
       FOR UPDATE`,
      [appointmentId]
    );

    if (apptRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appt = apptRes.rows[0];

    if (appt.status !== "Booked") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Only Booked appointments can be completed" });
    }

    // Update appointment status
    const updated = await client.query(
      `UPDATE appointments
       SET status = 'Completed', completed_at = NOW()
       WHERE appointment_id = $1
       RETURNING appointment_id, status, completed_at`,
      [appointmentId]
    );

    // Keep slot status in sync
    await client.query(
      `UPDATE advisor_slots
       SET status = 'Completed'
       WHERE slot_id = $1`,
      [appt.slot_id]
    );

    await client.query("COMMIT");
    res.json(updated.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.log("APPOINTMENT ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};
