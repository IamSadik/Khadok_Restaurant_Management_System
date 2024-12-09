const db = require('../config/configdb');

const createRider = async (name, email, hashedPassword) => {
    const query = 'INSERT INTO rider (name, email, password) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.query(query, [name, email, hashedPassword], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = { createRider };
