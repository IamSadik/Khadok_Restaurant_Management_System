// /routes/restaurantRoutes.js

const express = require('express');
const router = express.Router();
const {
    getTopRatedRestaurants,
    searchRestaurantsController,
    getCategories,
    getMenuItemsByCategory, getCategoriesByRestaurant, getConsumerMenuItemsByCategory // Make sure this is imported
} = require('../controllers/restaurantController');
const { getAllRestaurants } = require('../controllers/restaurantController');

router.get('/api/restaurants', getAllRestaurants);
// Route for fetching top-rated restaurants
router.get('/top-rated-restaurants', getTopRatedRestaurants);

// Route for dynamic search
router.get('/api/search-restaurants', searchRestaurantsController);

// Route to fetch categories for the logged-in stakeholder
router.get('/menu/categories', getCategories);

// New route to fetch categories based on restaurantId from frontend
router.get('/menu/categories/:restaurantId', getCategoriesByRestaurant);

// Route to fetch menu items by category
router.get('/menu/items/:category', getMenuItemsByCategory);

// Route to fetch menu items by restaurant ID and category
router.get('/menu/items/:restaurantId/:category', getConsumerMenuItemsByCategory);


module.exports = router;
