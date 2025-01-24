// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { loginConsumer, loginStakeholder, loginRider  } = require("../controllers/authController");
const { logout , getEmail} = require('../controllers/authController');
const { logoutHandler } = require('../controllers/authController');
const { getStakeholderId } = require('../controllers/authController');
const { addMenuItem } = require('../controllers/menuController');
const { isStakeholderLoggedIn } = require('../middlewares/authMiddleware');
// Logout route stakeholder
router.post('/logout', logoutHandler);

router.post('/login-consumer', (req, res, next) => {
    console.log('Route hit:', req.body);
    next(); // Pass control to loginConsumer
}, loginConsumer);

router.post("/login-stakeholder", loginStakeholder); // POST for stakeholder login
router.post('/add-menu-item', isStakeholderLoggedIn, addMenuItem);
router.get('/logout', logout); // Add logout route
router.get('/email', getEmail); // Add endpoint to fetch logged-in email

// Route for Rider login
router.post('/login-rider', (req, res, next) => {
    console.log('Rider login route hit:', req.body);
    next(); // Pass control to loginRider
}, loginRider);


router.get('/stakeholder-id', (req, res) => {
    
    if (req.session && req.session.user && req.session.user.type === 'stakeholder') {
        // Send stakeholder_id from session
        return res.json({ stakeholder_id: req.session.user.id });
    } else {
        return res.status(401).json({ error: 'Not authenticated or session expired' });
    }
});
router.get('/consumer-id', (req, res) => {
    if (req.session && req.session.user && req.session.user.type === 'consumer') {
        res.json({ success: true, consumer_id: req.session.user.id });
    } else {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
});




module.exports = router;
