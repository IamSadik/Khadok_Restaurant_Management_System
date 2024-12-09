// config/connectdb.js
const mysql = require('mysql');
const config = require('./config');
//const mysql2 = require('mysql2/promise');
// /config/configdb.js


// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost', // Replace with your DB host
    user: 'root',      // Replace with your DB user
    password: '',      // Replace with your DB password
    database: 'khadok', // Replace with your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the pool
module.exports = pool;

