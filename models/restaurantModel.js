// /models/restaurantModel.js

const pool = require('../config/configdb'); // Import your DB connection

// Function to get top-rated restaurants from the database
const getTopRatedRestaurantsFromDB = async () => {
    const query = `
        SELECT stakeholder_id, restaurant_name, ratings
        FROM stakeholder
        ORDER BY ratings DESC
        LIMIT 6
    `;
    
    return new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};



// Import mysql2/promise for search operations
const mysql2 = require('mysql2/promise');

// Create a separate connection for search using mysql2/promise
const searchPool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'khadok',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});



// Function to search for restaurants based on query using mysql2/promise
const searchRestaurants = async (searchQuery) => {
    const sql = `SELECT restaurant_name, stakeholder_id FROM stakeholder WHERE restaurant_name LIKE ?`;
    const values = [`%${searchQuery}%`];

    try {
        // Use the searchPool connection for search queries
        const [results] = await searchPool.execute(sql, values);
        return results;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
};
const getAllRestaurantsModel = async (sortBy) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT stakeholder_id, restaurant_name, ratings FROM stakeholder`;

        // Apply sorting based on the query parameter
        if (sortBy === 'ratings') {
            query += ` ORDER BY ratings DESC`;
        } else if (sortBy === 'name') {
            query += ` ORDER BY restaurant_name ASC`;
        }

        pool.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};



  module.exports = { getTopRatedRestaurantsFromDB , searchRestaurants, getAllRestaurantsModel};