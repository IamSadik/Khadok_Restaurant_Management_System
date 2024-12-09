const pool = require('../config/configdb');

exports.createConsumer = async (name, email, password) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'INSERT INTO consumer (name, email, password) VALUES (?, ?, ?)',
            [name, email, password],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

