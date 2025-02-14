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



// Function to get dine-in reservations based on consumer_id
const getDineInReservations2 = async (query) => {
    let sql = `SELECT dine_in_id, table_size, quantity, booking_date, booking_time, status, message 
               FROM dine_in WHERE consumer_id = ?`;
    const params = [query.consumer_id];

    if (query.status) {
        sql += " AND status = ?";
        params.push(query.status);
    }

    sql += " ORDER BY booking_date DESC"; // Latest orders on top

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



// Function to get orders for a stakeholder
const getOrders = (stakeholderId, status) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM orders WHERE stakeholder_id = ?";
        const params = [stakeholderId];

        if (status !== "all") {
            query += " AND status = ?";
            params.push(status);
        }

        db.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Function to get pickups for a stakeholder
const getPickups = (stakeholderId, status) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM pickup WHERE stakeholder_id = ?";
        const params = [stakeholderId];

        if (status !== "all") {
            query += " AND status = ?";
            params.push(status);
        }

        db.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};


// Function to insert into orders and delivery tables
const createDeliveryOrder = async (orderData) => {
    return new Promise((resolve, reject) => {
        // First, insert into orders table
        const orderQuery = `
            INSERT INTO orders (stakeholder_id, consumer_id, order_date, status, total_amount)
            VALUES (?, ?, NOW(), ?, ?)
        `;

        const orderValues = [
            orderData.stakeholder_id,
            orderData.consumer_id,
            'pending',  // Default status
            orderData.total_amount
        ];

        db.query(orderQuery, orderValues, (err, orderResult) => {
            if (err) {
                reject(err);
            } else {
                const orderId = orderResult.insertId; // Get the inserted order ID

                // Now, insert into delivery table using the newly created order_id
                const deliveryQuery = `
                    INSERT INTO delivery (consumer_id, status, total_amount, rider_id)
VALUES (?, ?, ?, 0)

                `;

                const deliveryValues = [
                    orderData.consumer_id,
                    'pending',  // Default status
                    orderData.total_amount
                ];

                db.query(deliveryQuery, deliveryValues, (err, deliveryResult) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            orderId: orderId,
                            deliveryId: deliveryResult.insertId
                        });
                    }
                });
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
    getDineInReservations2, getOrders, getPickups, createDeliveryOrder
};
