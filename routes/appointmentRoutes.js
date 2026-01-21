const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Book appointment (student)
router.post("/", appointmentController.bookAppointment);

// Student appointments
router.get("/student/:id", appointmentController.getStudentAppointments);

// Advisor appointments
router.get("/advisor/:id", appointmentController.getAdvisorAppointments);

// Mark completed (advisor)
router.put("/:id/complete", appointmentController.completeAppointment);

module.exports = router;
