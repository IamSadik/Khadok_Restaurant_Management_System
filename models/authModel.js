const pool = require('../config/configdb');

// Fetch consumer by email
exports.getConsumerByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM consumer WHERE email = ?', [email], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]); // Assuming 'consumer' table exists
        });
    });
};

// Fetch stakeholder by email
exports.getStakeholderByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM stakeholder WHERE email = ?', [email], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]); // Assuming 'stakeholder' table exists
        });
    });
};


=======
// Fetch rider by email
exports.getRiderByEmail = async (email) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM rider WHERE email = ?';
        console.log('Executing Query:', query, [email]);

        pool.query(query, [email], (err, results) => {
            if (err) {
                console.error('Database Query Error:', err);
                return reject(err);
            }

            console.log('Query Results:', results);
            resolve(results[0]); // Assuming 'rider' table exists
        });
    });
};

