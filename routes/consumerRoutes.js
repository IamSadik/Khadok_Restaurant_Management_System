const express = require('express');
const router = express.Router();
const {
    getNames
} = require('../controllers/consumerController');


// Import your login controller (if needed)
const { loginHandler } = require('../controllers/consumerController');

router.get('/get-Name-details', getNames);

module.exports = router;

