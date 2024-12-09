const express = require('express');
const { signupRider } = require('../controllers/riderController');
const router = express.Router();

router.post('/signup', signupRider);

module.exports = router;
