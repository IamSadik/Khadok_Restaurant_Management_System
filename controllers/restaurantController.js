// /controllers/restaurantController.js

const { getTopRatedRestaurantsFromDB } = require('../models/restaurantModel');
const { searchRestaurants } = require('../models/restaurantModel');

// Controller to handle fetching top-rated restaurants
const getTopRatedRestaurants = async (req, res) => {
    try {
        const restaurants = await getTopRatedRestaurantsFromDB();
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching top-rated restaurants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Controller to handle searching for restaurants
const searchRestaurantsController = async (req, res) => {
    const searchQuery = req.query.query;  // Get the query from the URL parameters
    if (!searchQuery) {
      return res.status(400).json([]);  // Return an empty array if no query is provided
    }
  
    try {
      const results = await searchRestaurants(searchQuery);  // Call the model to get search results
      res.json(results);  // Send the results as JSON
    } catch (error) {
      console.error('Error in searchRestaurants controller:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
// Ensure both controllers are exported
module.exports = {
    getTopRatedRestaurants,
    searchRestaurantsController
};
