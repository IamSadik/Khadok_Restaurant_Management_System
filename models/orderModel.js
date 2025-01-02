const pool = require('../config/configdb');

const getOrdersFromDB = async () => {
    const query = `
        SELECT 
            o.order_id,
            c.name AS consumer_name,
            o.total_amount,
            o.order_date,
            o.status,
            CASE 
                WHEN o.status = 'Paid' THEN 'Paid'
                ELSE 'Due'
            END AS payment
        FROM orders o
        JOIN consumer c ON o.consumer_id = c.consumer_id;
    `;

    return new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};



module.exports = { getOrdersFromDB };
