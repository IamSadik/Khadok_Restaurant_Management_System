const Order = require('../models/orderModel');
const Consumer = require("../models/consumerModel");
const Pickup = require('../models/orderModel');
const Cart = require('../models/orderModel'); // Assuming you have a cart model for database operations
const fetch = require('node-fetch');

const Delivery = require('../models/orderModel');

const db = require('../config/configdb');
const bookTable = async (req, res) => {
    try {
        const {
            consumer_id,
            stakeholder_id,
            table_size,
            quantity,
            booking_date,
            booking_time,
            message,
        } = req.body;

        if (!consumer_id || !stakeholder_id || !table_size || !quantity || !booking_date || !booking_time) {
            return res.status(400).json({ message: "All fields except the message are required" });
        }

        // Check if the table type exists and has enough bookable count
        const tableDetails = await Order.getTableAvailability(stakeholder_id, table_size);

        if (!tableDetails) {
            return res.status(400).json({ message: "Invalid table type for this restaurant" });
        }

        if (tableDetails.bookable < quantity) {
            return res.status(400).json({ message: "Not enough tables available for booking" });
        }

        // Insert booking details into dine_in table
        await Order.bookDineInTable(
            consumer_id,
            stakeholder_id,
            table_size,
            quantity,
            booking_date,
            booking_time,
            message || null // Handle optional message
        );

        // Update the interior table by reducing the bookable count
        await Order.updateTableAvailability(stakeholder_id, table_size, quantity);

        res.status(200).json({ message: "Table booked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error booking table", error: error.message });
    }
};


// Function to get stakeholder_id from the session using the API route
const getStakeholderId = async (req) => {
    try {
        const response = await fetch('http://localhost:3000/auth/stakeholder-id', {
            headers: { cookie: req.headers.cookie }, // Pass cookies to maintain session
        });

        if (!response.ok) throw new Error('Failed to fetch stakeholder ID');

        const data = await response.json();
        console.log("Fetched stakeholder ID:", data.stakeholder_id);
        return data.stakeholder_id;
    } catch (error) {
        console.error('Error fetching stakeholder ID:', error);
        return null;
    }
};

// Get reservations based on stakeholder session and filter
const getReservations = async (req, res) => {
    try {
        // Fetch stakeholder ID from the session API
        const stakeholderId = await getStakeholderId(req);
        
        if (!stakeholderId) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        const filter = req.query.filter;
        let query = { stakeholder_id: stakeholderId };

        // Apply filter based on query parameter (upcoming, past, etc.)
        if (filter === "upcoming") {
            query.status = "pending";
        } else if (filter === "past") {
            query.status = "complete";
        }

        // Fetch dine-in reservations from the model
        const reservations = await Order.getDineInReservations(query);
        res.json(reservations);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Function to update the status of the dine_in reservation
const updateReservationStatus = async (req, res) => {
    const { dine_in_id, stakeholder_id, consumer_id, table_size, quantity } = req.body;

    try {
        const sql = `
            UPDATE dine_in
            SET status = 'complete'
            WHERE dine_in_id = ? AND stakeholder_id = ? AND consumer_id = ? AND table_size = ? AND quantity = ?
        `;
        const params = [dine_in_id, stakeholder_id, consumer_id, table_size, quantity];

        db.query(sql, params, (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Error updating reservation status" });
            }
            res.status(200).json({ message: "Reservation status updated to complete" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Function to update the 'bookable' count in the interior table
const updateInteriorBookable = async (req, res) => {
    let { stakeholder_id, table_size, quantity } = req.body;

    try {
        // Ensure table_size is treated as a string to match the ENUM column correctly
        table_size = table_size.toString();

        const sql = `
            UPDATE interior
            SET bookable = bookable + ?
            WHERE stakeholder_id = ? AND table_type = ?
        `;
        const params = [quantity, stakeholder_id, table_size];

        db.query(sql, params, (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Error updating interior bookable count" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "No matching table found for update" });
            }
            res.status(200).json({ message: "Interior bookable count updated" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to place a pick-up order
const placePickupOrder = async (req, res) => {
    try {
        const { consumer_id, total_amount, stakeholder_id } = req.body;

        if (!consumer_id || !total_amount || !stakeholder_id) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        const pickupData = {
            consumer_id,
            total_amount,
            stakeholder_id,
            status: 'pending'  // Default status
        };

        // Create the pickup order
        const result = await Pickup.createPickupOrder(pickupData);

        if (result.affectedRows > 0) {
            // Empty the cart for the logged-in consumer
            await Cart.clearCart(consumer_id);

            res.status(201).json({ success: true, message: 'Pickup order placed successfully, and cart cleared.' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to place pickup order.' });
        }
    } catch (error) {
        console.error('Error placing pickup order:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// Controller function to get pickup orders based on consumer_id and status filter
const getPickupOrders = async (req, res) => {
    try {
        const { consumer_id, status } = req.query;

        if (!consumer_id) {
            return res.status(400).json({ success: false, message: "Consumer ID is required" });
        }

        let queryCondition = { consumer_id };

        if (status && status !== "all") {
            queryCondition.status = status;
        }

        // Fetch orders with the given conditions, sorted by latest first
        const orders = await Order.getPickupOrders(queryCondition);

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get reservations for a consumer
const getConsumerReservations = async (req, res) => {
    try {
        const consumerId = req.query.consumer_id;
        const filter = req.query.filter || "all";

        if (!consumerId) {
            return res.status(400).json({ error: "Consumer ID is required" });
        }

        let query = { consumer_id: consumerId };

        // Filter condition
        if (filter === "upcoming") {
            query.status = "pending";
        } else if (filter === "past") {
            query.status = "complete";
        }

        const reservations = await Order.getDineInReservations2(query);

        if (!reservations.length) {
            return res.status(200).json([]);
        }

        res.json(reservations);
    } catch (error) {
        console.error("Error fetching consumer reservations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to get orders for a stakeholder by status
const getOrdersByStakeholderId = async (stakeholderId, status) => {
    try {
        const orders = await Order.getOrders(stakeholderId, status);
        return orders;
    } catch (error) {
        throw new Error("Error fetching orders: " + error.message);
    }
};


const getPickupsByStakeholderId = async (stakeholderId, status) => {
    try {
        const pickups = await Order.getPickups(stakeholderId, status);
        return pickups;
    } catch (error) {
        throw new Error("Error fetching pickups: " + error.message);
    }
};

// Controller function to place a delivery order
const placeDeliveryOrder = async (req, res) => {
    try {
        const { consumer_id, total_amount, stakeholder_id } = req.body;

        if (!consumer_id || !total_amount || !stakeholder_id) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        const orderData = {
            consumer_id,
            total_amount,
            stakeholder_id
        };

        // Insert into orders and delivery tables
        const result = await Order.createDeliveryOrder(orderData);

        if (result.orderId && result.deliveryId) {
            res.status(201).json({
                success: true,
                message: 'Delivery order placed successfully, and cart cleared.',
                orderId: result.orderId,
                deliveryId: result.deliveryId
            });
        } else {
            res.status(500).json({ success: false, message: 'Failed to place delivery order.' });
        }
    } catch (error) {
        console.error('Error placing delivery order:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = { getReservations, bookTable , updateReservationStatus, updateInteriorBookable, placePickupOrder,getPickupOrders, getConsumerReservations, getOrdersByStakeholderId , getPickupsByStakeholderId, placeDeliveryOrder };
