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

module.exports = { getUniqueStakeholderId, createStakeholder };
