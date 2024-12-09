// routes/restaurantRoutes.js

const express = require("express");
const router = express.Router();
const { searchRestaurants } = require("./searchRestaurantController");

// Route for searching restaurants
router.get("/search-restaurants", searchRestaurants);

module.exports = router;
