// /routes/restaurantRoutes.js

const express = require('express');
const router = express.Router();
const {
    getTopRatedRestaurants,
    searchRestaurantsController,
    getCategories,
    getMenuItemsByCategory // Make sure this is imported
} = require('../controllers/restaurantController');

// Route for fetching top-rated restaurants
router.get('/top-rated-restaurants', getTopRatedRestaurants);

// Route for dynamic search
router.get('/api/search-restaurants', searchRestaurantsController);

// Route to fetch categories for the logged-in stakeholder
router.get('/menu/categories', getCategories);

// Route to fetch menu items by category
router.get('/menu/items/:category', getMenuItemsByCategory);

module.exports = router;
