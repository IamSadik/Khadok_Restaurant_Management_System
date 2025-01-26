const express = require("express");
const router = express.Router();
const { loginAdmin, getConsumers, deleteConsumer } = require("../controllers/adminController");

// Admin login route
router.post("/login", loginAdmin);

// Route to fetch all consumers
router.get("/consumers", getConsumers);

// Route to delete a consumer
router.delete("/consumers/:id", deleteConsumer);

module.exports = router;

