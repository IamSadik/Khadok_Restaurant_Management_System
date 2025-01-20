const menuModel = require('../models/menuModel');
const { fetchMenuByRestaurant } = require('../models/menuModel');
// Get all menu items for a stakeholder
const getMenuItems = async (req, res) => {
    const { stakeholder_id } = req.query;

    try {
        if (!stakeholder_id) {
            return res.status(400).json({ error: 'Stakeholder ID is required' });
        }

        const menuItems = await menuModel.getMenuItems(stakeholder_id);
        res.status(200).json(menuItems);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
};

// Get a specific menu item by ID
const getMenuItemById = async (req, res) => {
    const { menu_id } = req.params;

    try {
        const menuItem = await menuModel.getMenuItemById(menu_id);
        res.status(200).json(menuItem);
    } catch (error) {
        console.error('Error fetching menu item:', error);
        res.status(500).json({ error: 'Failed to fetch menu item' });
    }
};

// Add a new menu item
const addMenuItem = async (req, res) => {
    const { stakeholder_id, item_name, category, item_price, description } = req.body;
    const item_picture = req.file ? req.file.filename : null;

    // Debugging logs
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);

    try {
        if (!stakeholder_id || !item_name || !category || !item_price) {
            return res.status(400).json({ error: 'Required fields are missing' });
        }

        const result = await menuModel.addMenuItem({
            stakeholder_id,
            item_name,
            category,
            item_price,
            description,
            item_picture,
        });

        res.status(201).json({ message: 'Menu item added successfully', menu_id: result.insertId });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ error: 'Failed to add menu item' });
    }
};


// Update a menu item
const updateMenuItem = async (req, res) => {
    const { menu_id } = req.params;
    const { item_name, category, item_price, description } = req.body;
    const item_picture = req.file ? req.file.filename : null;

    try {
        if (!menu_id) {
            return res.status(400).json({ error: 'Menu ID is required' });
        }

        await menuModel.updateMenuItem(menu_id, {
            item_name,
            category,
            item_price,
            description,
            item_picture,
        });

        res.status(200).json({ message: 'Menu item updated successfully' });
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
};

// Delete a menu item
const deleteMenuItem = async (req, res) => {
    const { menu_id } = req.params;

    try {
        if (!menu_id) {
            return res.status(400).json({ error: 'Menu ID is required' });
        }

        await menuModel.deleteMenuItem(menu_id);
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
};

// Controller function to get menu items for a specific restaurant
const getMenuByRestaurant = async (req, res) => {
    const { stakeholder_id } = req.params;

    try {
        if (!stakeholder_id || isNaN(stakeholder_id)) {
            return res.status(400).json({ success: false, message: 'Invalid restaurant ID.' });
        }

        console.log('Fetching menu for stakeholder_id:', stakeholder_id);

        const menuItems = await fetchMenuByRestaurant(stakeholder_id);

        if (!menuItems || menuItems.length === 0) {
            return res.status(404).json({ success: false, message: 'No menu items found for this restaurant.' });
        }

        res.status(200).json({ success: true, menu: menuItems });
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching menu.' });
    }
};


module.exports = { getMenuItems, getMenuItemById, addMenuItem, updateMenuItem, deleteMenuItem, getMenuByRestaurant };
