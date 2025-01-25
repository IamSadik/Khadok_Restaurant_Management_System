const express = require('express');
const router = express.Router();
const { addTables, uploadImage, getInteriorImage, removeTables, getConsumerTableInfo, getConsumerInteriorImage, getConsumerBookableInfo, getBookableInfo } = require('../controllers/interiorController');
const { getTableInfo } = require('../controllers/interiorController');
const upload = require('../utils/imageProcessing'); // Use the utility file
const { deleteImage } = require("../controllers/interiorController");

// Fetch table data for a stakeholder
router.get('/fetch-table-info', getTableInfo);
router.get('/fetch-consumer-table-info', getConsumerTableInfo);
router.get('/get-consumer-interior-image', getConsumerInteriorImage);
router.get('/fetch-consumer-bookable-info', getConsumerBookableInfo);


router.post('/add-tables', addTables); // Add tables
router.post('/upload-image', upload.single('interiorImage'), uploadImage); // Upload 360 image
router.get('/get-interior-image', getInteriorImage); // Fetch 360 image for 3D view
router.post('/remove-tables', removeTables); // Remove tables
router.delete("/delete-image", deleteImage); // Delete 360 image
// Route for fetching table bookable data
router.get('/fetch-bookable-info', getBookableInfo);


module.exports = router;
