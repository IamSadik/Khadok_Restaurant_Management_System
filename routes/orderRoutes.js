// /routes/restaurantRoutes.js

const express = require('express');
const router = express.Router();
const {
    getOrders
} = require('../controllers/orderController');

// Route for fetching top-rated restaurants
router.get('/get-order-details', getOrders);


module.exports = router;
