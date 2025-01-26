const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { getMenuByRestaurant } = require('../controllers/menuController');
const upload = require('../utils/imageProcessing');




// Routes
router.get('/', menuController.getMenuItems);
router.get('/:menu_id', menuController.getMenuItemById); // Fetch a specific menu item
router.post('/', upload.single('item_picture'), menuController.addMenuItem);
router.put('/:menu_id', upload.single('item_picture'), menuController.updateMenuItem);
router.delete('/:menu_id', menuController.deleteMenuItem);


// Get menu items by stakeholder ID
router.get('/by-stakeholder', async (req, res) => {
    const { stakeholder_id } = req.query; // Get the stakeholder ID from query params
    try {
        const menuItems = await menuModel.getMenuItemsByStakeholder(stakeholder_id);
        res.json(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

const multer = require('multer');

// menuRoutes.js
router.get('/menu-builder', (req, res) => {
    console.log('Session in /menu-builder:', req.session); // Log session
    if (req.session.stakeholder_id) {
        res.render('menu-builder', { stakeholder_id: req.session.stakeholder_id });
    } else {
        res.redirect('/login');
    }
});

// Route to fetch menu by restaurant ID
router.get('/:stakeholder_id', getMenuByRestaurant);

module.exports = router;
