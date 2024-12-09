// /routes/restaurantRoutes.js

const express = require('express');
const router = express.Router();
const {
    getTopRatedRestaurants,
    searchRestaurantsController
} = require('../controllers/restaurantController');

// Route for fetching top-rated restaurants
router.get('/top-rated-restaurants', getTopRatedRestaurants);

// Route for dynamic search
router.get('/api/search-restaurants', searchRestaurantsController);

module.exports = router;
