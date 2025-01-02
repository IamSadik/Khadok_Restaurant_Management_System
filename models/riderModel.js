const db = require('../config/configdb');

// Generate unique ID for rider
const getUniqueRiderId = async () => {
    const query = 'SELECT rider_id FROM rider ORDER BY rider_id DESC LIMIT 1';
    return new Promise((resolve, reject) => {
        db.query(query, [], (err, results) => {
            if (err) return reject(err);
            const lastId = results.length > 0 ? parseInt(results[0].rider_id, 10) : -1;
            resolve(lastId + 1); // Increment last ID by 1
        });
    });
};

// Create a new rider
const createRider = async (riderId, name, email, hashedPassword) => {
    const query = 'INSERT INTO rider (rider_id, name, email, password) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.query(query, [riderId, name, email, hashedPassword], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = { getUniqueRiderId, createRider };
