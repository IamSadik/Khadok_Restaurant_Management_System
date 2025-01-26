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





// Function to create a new pick-up order
const createPickupOrder = (pickupData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO pickup (consumer_id, pickup_date, status, total_amount, stakeholder_id)
            VALUES (?, NOW(), ?, ?, ?)
        `;

        const values = [
            pickupData.consumer_id,
            pickupData.status,
            pickupData.total_amount,
            pickupData.stakeholder_id
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
// Function to clear all items in the cart for a specific consumer
const clearCart = (consumer_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM cart WHERE consumer_id = ?
        `;
        
        db.query(query, [consumer_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
// Function to get pickup orders based on consumer_id and optional status filter
const getPickupOrders = ({ consumer_id, status }) => {
    return new Promise((resolve, reject) => {
        let query = `
            SELECT pickup_date, status, total_amount 
            FROM pickup 
            WHERE consumer_id = ? 
        `;

        let values = [consumer_id];

        if (status) {
            query += ` AND status = ?`;
            values.push(status);
        }

        query += ` ORDER BY pickup_date DESC`; // Latest orders first

        db.query(query, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};



const getDineInReservations2 = async (query) => {
    let sql = `SELECT dine_in_id, table_size, quantity, booking_date, booking_time, status, message 
               FROM dine_in WHERE consumer_id = ?`;
    const params = [query.consumer_id];

    if (query.status) {
        sql += " AND status = ?";
        params.push(query.status);
    }

    sql += " ORDER BY booking_date DESC";

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
    getDineInReservations,
    createPickupOrder ,
    clearCart,
    getPickupOrders,
    getDineInReservations2
};
