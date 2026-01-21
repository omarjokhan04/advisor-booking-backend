const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all advisors (for dropdown/filter)
router.get("/advisors", userController.getAdvisors);

module.exports = router;
