const express = require('express');
const { signupConsumer } = require('../controllers/consumerController');

const router = express.Router();
const {
    getNames
} = require('../controllers/consumerController');



// Import your login controller (if needed)
// const { loginHandler } = require('../controllers/consumerController');

router.get('/get-Name-details', getNames);

router.post('/signup', signupConsumer);


module.exports = router;
