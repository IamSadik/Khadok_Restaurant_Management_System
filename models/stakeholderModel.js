const db = require('../config/configdb');

// Generate unique ID for stakeholder
const getUniqueStakeholderId = async () => {
    const query = 'SELECT stakeholder_id FROM stakeholder ORDER BY stakeholder_id DESC LIMIT 1';
    return new Promise((resolve, reject) => {
        db.query(query, [], (err, results) => {
            if (err) return reject(err);
            const lastId = results.length > 0 ? parseInt(results[0].stakeholder_id, 10) : -1;
            resolve(lastId + 1); // Increment last ID by 1
        });
    });
};

// Create a new stakeholder
const createStakeholder = async (stakeholderId, name, email, hashedPassword, restaurantName) => {
    const query = 'INSERT INTO stakeholder (stakeholder_id, name, email, password, restaurant_name) VALUES (?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.query(query, [stakeholderId, name, email, hashedPassword, restaurantName], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Function to fetch location by stakeholder ID
const getLocationById = async (stakeholderId) => {
    const query = `SELECT area, address FROM stakeholder WHERE stakeholder_id = ?`;
    const params = [stakeholderId];

    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else if (results.length > 0) {
                resolve(results[0]);
            } else {
                resolve(null);
            }
        });
    });
};


module.exports = { getUniqueStakeholderId, createStakeholder , getLocationById};
