const db = require('../config/configdb');

// Fetch the maximum consumer_id from the database
const getMaxConsumerId = async () => {
    const query = 'SELECT MAX(consumer_id) AS max_id FROM consumer';
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results[0]?.max_id || null);
        });
    });
};

// Insert a new consumer into the database
const createConsumer = async (consumerId, name, email, hashedPassword) => {
    const query = 'INSERT INTO consumer (consumer_id, name, email, password ) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.query(query, [consumerId, name, email, hashedPassword], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};



// Function to fetch cart items from the database
const fetchCartItems = (consumer_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT item_name, quantity, item_price, item_id 
            FROM cart 
            WHERE consumer_id = ?
        `;
        db.query(query, [consumer_id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

// Export the function correctly

module.exports = { getMaxConsumerId, createConsumer,fetchCartItems };
