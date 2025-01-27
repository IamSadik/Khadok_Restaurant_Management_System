const express = require('express');
const router = express.Router();
const { bookTable, getReservations } = require("../controllers/orderController");
const { updateReservationStatus, updateInteriorBookable , placePickupOrder , getPickupOrders, getConsumerReservations } = require('../controllers/orderController');

const { getOrdersByStakeholderId, getPickupsByStakeholderId } = require("../controllers/orderController");
const { placeDeliveryOrder } = require('../controllers/orderController');

router.post('/book-table', bookTable);

// Ensure the stakeholder is authenticated
router.get("/reservations",  getReservations);



// Route to update reservation status
router.post('/update-status', updateReservationStatus);

// Route to update interior bookable count
router.post('/update-interior', updateInteriorBookable);


// Route to place a pickup order
router.post('/pickup', placePickupOrder);

// Route to get consumer pickup orders
router.get('/pickup', getPickupOrders);

// Route to fetch reservations based on consumer_id and filter
router.get("/reservation", getConsumerReservations);

// API route to fetch orders and pickups for a given stakeholder
router.get("/pickups", async (req, res) => {
    const { stakeholder_id, status } = req.query;

    try {
        // Get orders and pickups based on status
        const orders = await getOrdersByStakeholderId(stakeholder_id, status);
        const pickups = await getPickupsByStakeholderId(stakeholder_id, status);

        res.json({
            success: true,
            orders: [...orders, ...pickups] // Merge both orders and pickups
        });
    } catch (error) {
        console.error("Error fetching orders/pickups:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// Route to fetch orders by stakeholder ID and status
router.get("/", async (req, res) => {
    const { stakeholder_id, status } = req.query;

    if (!stakeholder_id) {
        return res.status(400).json({ success: false, message: "Stakeholder ID is required." });
    }

    try {
        const orders = await getOrdersByStakeholderId(stakeholder_id, status);
        res.json({
            success: true,
            orders: orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders." });
    }
});

router.post('/delivery', placeDeliveryOrder);


module.exports = router;
