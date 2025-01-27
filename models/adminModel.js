const pool = require("../config/configdb");

// Fetch admin by email
const getAdminByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]); // Assuming the 'admin' table exists and contains an email column
        });
    });
};


// Model to fetch consumers
const fetchConsumers = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT consumer_id,name, email,phone_number FROM consumer WHERE flag=0'; // Query to fetch name and email
        pool.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching consumers from DB:', err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};



// Mark consumer as deleted
const markConsumerAsDeleted = (consumerId) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE consumer SET flag = 1, email = 'abc@gmail.com' WHERE consumer_id = ?";
        pool.query(query, [consumerId], (err, results) => {
            if (err) {
                console.error("Error updating consumer:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};



// Fetch stakeholders
const fetchStakeholders = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                stakeholder_id, 
                name, 
                email, 
                restaurant_name, 
                ratings,area
                
            FROM stakeholder 
            WHERE flag IS NULL OR flag = 0
        `;
        pool.query(query, (err, results) => {
            if (err) {
                console.error("Error fetching stakeholders from DB:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// Mark stakeholder as deleted
const markStakeholderAsDeleted = (stakeholderId) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE stakeholder 
            SET flag = 1, email = 'abc@gmail.com' 
            WHERE stakeholder_id = ?
        `;
        pool.query(query, [stakeholderId], (err, results) => {
            if (err) {
                console.error("Error updating stakeholder:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = { fetchConsumers, markConsumerAsDeleted, fetchStakeholders, markStakeholderAsDeleted,getAdminByEmail };

