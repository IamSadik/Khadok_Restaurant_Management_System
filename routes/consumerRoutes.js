const express = require('express');
const { signupConsumer, addToCart, updateCartItem, deleteCartItem, getConsumerDetails } = require('../controllers/consumerController');
const { getCartItems } = require('../controllers/consumerController');
const router = express.Router();

// Define routes
router.post('/signup', signupConsumer);
router.post('/cart/add', addToCart);
// Route to fetch cart items
router.get('/cart/:consumer_id', getCartItems);
router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false, message: 'No user session found' });
    }
});


// Route to update cart item quantity
router.post('/cart/update/:itemId', updateCartItem);

// Route to delete a cart item
router.delete('/cart/delete/:itemId', deleteCartItem);

router.get('/details/:consumer_id', getConsumerDetails); // Add route to get consumer details



// Export the router
module.exports = router;
