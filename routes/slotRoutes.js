const express = require("express");
const router = express.Router();
const slotController = require("../controllers/slotController");

// GET available slots (student view)
router.get("/", slotController.getAvailableSlots);

// POST create slot (advisor)
router.post("/", slotController.createSlot);

// DELETE slot (advisor)
router.delete("/:id", slotController.deleteSlot);

module.exports = router;
