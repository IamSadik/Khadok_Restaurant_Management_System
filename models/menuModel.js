const db = require('../config/configdb');

// Helper function to execute queries
const executeQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

// Get all menu items for a specific stakeholder
const getMenuItems = async (stakeholderId) => {
    const query = 'SELECT * FROM menu WHERE stakeholder_id = ?';
    return await executeQuery(query, [stakeholderId]);
};

// Get a specific menu item by ID
const getMenuItemById = async (menuId) => {
    const query = 'SELECT * FROM menu WHERE menu_id = ?';
    return await executeQuery(query, [menuId]);
};

// Add a menu item
const addMenuItem = async (menuData) => {
    const query = `
        INSERT INTO menu (stakeholder_id, item_name, category, item_price, description, item_picture)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    return await executeQuery(query, [
        menuData.stakeholder_id,
        menuData.item_name,
        menuData.category,
        menuData.item_price,
        menuData.description,
        menuData.item_picture,
    ]);
};

// Update a menu item
const updateMenuItem = async (menuId, menuData) => {
    const query = `
        UPDATE menu
        SET item_name = ?, category = ?, item_price = ?, description = ?, item_picture = ?
        WHERE menu_id = ?
    `;
    return await executeQuery(query, [
        menuData.item_name,
        menuData.category,
        menuData.item_price,
        menuData.description,
        menuData.item_picture,
        menuId,
    ]);
};

// Delete a menu item
const deleteMenuItem = async (menuId) => {
    const query = 'DELETE FROM menu WHERE menu_id = ?';
    return await executeQuery(query, [menuId]);
};

// Function to get menu items by stakeholder ID
const getMenuItemsByStakeholder = (stakeholder_id, callback) => {
    const query = `
        SELECT * FROM menu
        WHERE stakeholder_id = ?
    `;
    
    pool.query(query, [stakeholder_id], (err, results) => {
        if (err) {
            console.error('Error fetching menu items:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};


// Model to fetch menu items for a restaurant
const fetchMenuByRestaurant = (stakeholder_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                menu_id, 
                item_name, 
                category, 
                item_price, 
                description, 
                item_picture 
            FROM 
                menu 
            WHERE 
                stakeholder_id = ?
        `;

        db.query(query, [stakeholder_id], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
const getMenuItemsByRestaurant = async (restaurantId) => {
    const query = 'SELECT * FROM menu WHERE stakeholder_id = ?';
    return await executeQuery(query, [restaurantId]);
};


module.exports = { getMenuItems, getMenuItemById, addMenuItem, updateMenuItem, deleteMenuItem, fetchMenuByRestaurant , getMenuItemsByStakeholder};
