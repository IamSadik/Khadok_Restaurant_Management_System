const Order = require('../models/orderModel');
const fetch = require('node-fetch');
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

module.exports = { getReservations, bookTable , updateReservationStatus, updateInteriorBookable};
