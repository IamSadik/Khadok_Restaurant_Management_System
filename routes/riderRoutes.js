const express = require('express');
const router = express.Router();

// Import your login controller (if needed)
const { loginRider } = require('../controllers/riderController');

// Define the POST route for login
router.post('/login', loginRider);

module.exports = router;