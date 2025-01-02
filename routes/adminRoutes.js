const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController");

// Admin login route
router.post("/login", loginAdmin);

module.exports = router;
