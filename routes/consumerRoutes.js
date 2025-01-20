const express = require('express');
const { signupConsumer, addToCart } = require('../controllers/consumerController');
const router = express.Router();

// Define routes
router.post('/signup', signupConsumer);
router.post('/cart/add', addToCart);

router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false, message: 'No user session found' });
    }
});


// Export the router
module.exports = router;
