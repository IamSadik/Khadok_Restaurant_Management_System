const express = require('express');
const router = express.Router();
const { bookTable, getReservations } = require("../controllers/orderController");
const { updateReservationStatus, updateInteriorBookable } = require('../controllers/orderController');




router.post('/book-table', bookTable);

// Ensure the stakeholder is authenticated
router.get("/reservations",  getReservations);



// Route to update reservation status
router.post('/update-status', updateReservationStatus);

// Route to update interior bookable count
router.post('/update-interior', updateInteriorBookable);



module.exports = router;
