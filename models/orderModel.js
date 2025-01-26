const db = require('../config/configdb');

// Function to check table availability in interior table
const getTableAvailability = (stakeholder_id, table_size) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT bookable FROM interior WHERE stakeholder_id = ? AND table_type = ?`;
        db.query(sql, [stakeholder_id, table_size], (err, results) => {
            if (err) reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};

// Function to insert data into dine_in table
const bookDineInTable = (consumer_id, stakeholder_id, table_size, quantity, booking_date, booking_time, message) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO dine_in (consumer_id, stakeholder_id, table_size, quantity, booking_date, booking_time, message) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [consumer_id, stakeholder_id, table_size, quantity, booking_date, booking_time, message], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Function to update table availability in interior table
const updateTableAvailability = (stakeholder_id, table_type, quantity) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE interior SET bookable = bookable - ? WHERE stakeholder_id = ? AND table_type = ?`;
        db.query(sql, [quantity, stakeholder_id, table_type], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Function to get dine-in reservations
const getDineInReservations = async (query) => {
    let sql = `SELECT dine_in_id, table_size, quantity, booking_date, booking_time, status, message 
               FROM dine_in WHERE stakeholder_id = ?`;
    const params = [query.stakeholder_id];

    if (query.status) {
        sql += " AND status = ?";
        params.push(query.status);
    }

    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getTableAvailability,
    bookDineInTable,
    updateTableAvailability,
    getDineInReservations
};
