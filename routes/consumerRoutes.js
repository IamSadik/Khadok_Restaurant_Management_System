const express = require('express');
const { signupConsumer } = require('../controllers/consumerController');

const router = express.Router();

router.post('/signup', signupConsumer);

module.exports = router;
