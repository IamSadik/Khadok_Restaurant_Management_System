const { getOrdersFromDB } = require('../models/orderModel');

const getOrders = async (req, res) => {
    try {
        const restaurants = await getOrdersFromDB();
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching top-rated restaurants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getOrders
};
