const express = require('express');

const { signupRider } = require('../controllers/riderController');
const router = express.Router();

router.post('/signup', signupRider);

module.exports = router;

const router = express.Router();

// Import your login controller (if needed)
const { loginRider } = require('../controllers/riderController');

// Define the POST route for login
router.post('/login', loginRider);

module.exports = router;

