const db = require('../config/configdb');

const createStakeholder = async (name, email, hashedPassword, restaurantName) => {
    const query = 'INSERT INTO stakeholder (name, email, password, restaurant_name) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.query(query, [name, email, hashedPassword, restaurantName], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = { createStakeholder };
