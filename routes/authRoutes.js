// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { loginConsumer, loginStakeholder,loginRider } = require("../controllers/authController");

router.post('/login-consumer', (req, res, next) => {
    console.log('Route hit:', req.body);
    next(); // Pass control to loginConsumer
}, loginConsumer);

router.post("/login-stakeholder", loginStakeholder); // POST for stakeholder login

// Route for Rider login
router.post('/login-rider', (req, res, next) => {
    console.log('Rider login route hit:', req.body);
    next(); // Pass control to loginRider
}, loginRider);

module.exports = router;
