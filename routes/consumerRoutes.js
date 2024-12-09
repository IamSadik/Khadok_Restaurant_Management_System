const express = require('express');
const router = express.Router();

// Import your login controller (if needed)
const { loginHandler } = require('../controllers/consumerController');

// Define the POST route for login
router.post('/login', loginHandler);

module.exports = router;
