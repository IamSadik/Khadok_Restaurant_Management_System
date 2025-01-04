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
  
  const db = require('../config/configdb');


// Fetch categories for the logged-in stakeholder
const getCategories = async (req, res) => {
  
  try {
    
    const stakeholderId = req.session.user.id; // Get stakeholder_id from session
    
   
    const query = 'SELECT DISTINCT category FROM menu WHERE stakeholder_id = ?';

    // Use db.query() for MySQL
    db.query(query, [stakeholderId], (error, results) => {
      if (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch categories' });
      }

      // Map the results to return only the category names
      const categories = results.map(row => row.category);
      res.status(200).json({ success: true, categories });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Fetch menu items by category for the logged-in stakeholder
const getMenuItemsByCategory = async (req, res) => {
  try {
    const stakeholderId = req.session.user.id; // Get stakeholder_id from session
    const category = req.params.category; // Get category from URL
    const query = 'SELECT * FROM menu WHERE stakeholder_id = ? AND category = ?';

    // Use db.query() for MySQL
    db.query(query, [stakeholderId, category], (error, results) => {
      if (error) {
        console.error('Error fetching menu items:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch menu items' });
      }

      res.status(200).json({ success: true, menuItems: results });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

  
// Ensure both controllers are exported
module.exports = {
    getTopRatedRestaurants,
    searchRestaurantsController, getCategories, getMenuItemsByCategory
};
