const pool = require("../config/configdb");

// Fetch admin by email
exports.getAdminByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]); // Assuming the 'admin' table exists and contains an email column
        });
    });
};
