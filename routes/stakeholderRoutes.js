const express = require('express');
const { signupStakeholder } = require('../controllers/stakeholderController');
const stakeholderController = require('../controllers/stakeholderController');



const router = express.Router();

router.post('/signup', signupStakeholder);

// Route to get stakeholder location
router.get('/get-stakeholder-location/:stakeholderId', stakeholderController.getStakeholderLocation);


module.exports = router;
