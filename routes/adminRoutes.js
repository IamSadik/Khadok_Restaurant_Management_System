const express = require("express");
const router = express.Router();
const { 
    loginAdmin, 
    getConsumers, 
    deleteConsumer, 
    getStakeholders, 
    deleteStakeholder 
} = require("../controllers/adminController");

// Admin login route
router.post("/login", loginAdmin);

// Route to fetch all consumers
router.get("/consumers", getConsumers);

// Route to delete a consumer
router.delete("/consumers/:id", deleteConsumer);

// Route to fetch all stakeholders
router.get("/stakeholders", getStakeholders);

// Route to delete a stakeholder
router.delete("/stakeholders/:id", deleteStakeholder);

module.exports = router;
