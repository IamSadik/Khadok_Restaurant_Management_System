// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { loginConsumer, loginStakeholder } = require("../controllers/authController");

router.post('/login-consumer', (req, res, next) => {
    console.log('Route hit:', req.body);
    next(); // Pass control to loginConsumer
}, loginConsumer);

router.post("/login-stakeholder", loginStakeholder); // POST for stakeholder login

module.exports = router;
