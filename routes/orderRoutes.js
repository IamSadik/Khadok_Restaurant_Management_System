const express = require('express');
const router = express.Router();
const { bookTable, getReservations } = require("../controllers/orderController");
const { updateReservationStatus, updateInteriorBookable , placePickupOrder , getPickupOrders, getConsumerReservations } = require('../controllers/orderController');




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

module.exports = router;
