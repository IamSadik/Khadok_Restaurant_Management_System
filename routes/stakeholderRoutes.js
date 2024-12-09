const express = require('express');
const { signupStakeholder } = require('../controllers/stakeholderController');

const router = express.Router();

router.post('/signup', signupStakeholder);

module.exports = router;
