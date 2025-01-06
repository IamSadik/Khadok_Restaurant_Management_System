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




const getCustomerNameFromDB = async () => {
    const query = `
        SELECT 
            name FROM consumer;
    `;

    return new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }});
            
        });
        
    };
// Insert a new consumer into the database
const createConsumer = async (consumerId, name, email, hashedPassword, phoneNumber) => {
    const query = 'INSERT INTO consumer (consumer_id, name, email, password, phone_number) VALUES (?, ?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
        db.query(query, [consumerId, name, email, hashedPassword, phoneNumber], (err, results) => {
            if (err) return reject(err);
            resolve(results);

        });
    });
};

module.exports = { getMaxConsumerId, createConsumer, getCustomerNameFromDB };

