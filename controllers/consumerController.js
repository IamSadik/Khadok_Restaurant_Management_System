const { fetchCartItems } = require('../models/consumerModel');
const bcrypt = require('bcrypt');
const { createConsumer, getMaxConsumerId } = require('../models/consumerModel');
const db = require('../config/configdb');
const consumerModel = require('../models/consumerModel');
exports.loginHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate user credentials (example: database query)
        const user = await User.findOne({ username });
        if (user && user.password === password) {
            res.send("Login successful!");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};




const signupConsumer = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Fetch the highest consumer_id
        const maxId = await getMaxConsumerId();
        const newConsumerId = maxId !== null ? maxId + 1:maxId+1;

        // Insert the new consumer into the database
        await createConsumer(newConsumerId, name, email, hashedPassword);

        res.status(201).json({ message: 'Consumer registered successfully', consumer_id: newConsumerId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering consumer' });
    }
};

// Add item to cart handler
const addToCart = (req, res) => {
    const { item_id, item_name, stakeholder_id, item_price } = req.body;

    // Fetch consumer_id from session
    const consumer_id = req.session && req.session.user ? req.session.user.id : null;

    if (consumer_id === null) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in again.' });
    }

    console.log('Adding item to cart for consumer:', consumer_id);

    const timestamp = new Date();

    // Check if item already exists in the cart
    const checkQuery = `
        SELECT * FROM cart 
        WHERE consumer_id = ? 
        AND stakeholder_id = ? 
        AND item_id = ? 
        AND item_name = ?
    `;

    db.query(checkQuery, [consumer_id, stakeholder_id, item_id, item_name], (err, results) => {
        if (err) {
            console.error('Error checking cart:', err);
            return res.status(500).json({ success: false, message: 'Failed to check cart' });
        }

        if (results.length > 0) {
            // Item exists, update quantity
            const updateQuery = `
                UPDATE cart 
                SET quantity = quantity + 1, updated_at = ? 
                WHERE consumer_id = ? 
                AND stakeholder_id = ? 
                AND item_id = ? 
                AND item_name = ?
            `;

            db.query(updateQuery, [timestamp, consumer_id, stakeholder_id, item_id, item_name], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating cart item:', updateErr);
                    return res.status(500).json({ success: false, message: 'Failed to update cart item' });
                }
                return res.status(200).json({ success: true, message: 'Cart item quantity updated successfully' });
            });

        } else {
            // Insert new item into cart with item_price
            const insertQuery = `
                INSERT INTO cart (consumer_id, item_id, quantity, added_at, updated_at, stakeholder_id, item_name, item_price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(insertQuery, [consumer_id, item_id, 1, timestamp, timestamp, stakeholder_id, item_name, item_price], (insertErr) => {
                if (insertErr) {
                    console.error('Error adding item to cart:', insertErr);
                    return res.status(500).json({ success: false, message: 'Failed to add item to cart' });
                }
                return res.status(200).json({ success: true, message: 'Item added to cart successfully' });
            });
        }
    });
};


// Controller function to fetch cart items
const getCartItems = async (req, res) => {
    const { consumer_id } = req.params;

    if (!consumer_id) {
        return res.status(400).json({ success: false, message: 'Consumer ID is required' });
        
    }

    try {
        const cartItems = await consumerModel.fetchCartItems(consumer_id);
        res.status(200).json({ success: true, data: cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch cart items' });
    }
};



const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'khadok'
});



// Update item quantity in the cart
const updateCartItem = (req, res) => {
    const itemId = req.params.itemId;
    
    const { change } = req.body;

    // SQL query to update quantity
    const sql = `
        UPDATE cart 
        SET quantity = GREATEST(0, quantity + ?) 
        WHERE item_id = ?
    `;

    pool.query(sql, [change, itemId], (err, result) => {
        if (err) {
            console.error('Error updating cart item:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        // If quantity becomes 0, delete the row
        if (result.affectedRows > 0) {
            pool.query('DELETE FROM cart WHERE item_id = ? AND quantity = 0', [itemId], (delErr) => {
                if (delErr) {
                    console.error('Error deleting item with zero quantity:', delErr);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.json({ success: true, message: 'Cart updated' });
            });
        } else {
            res.status(400).json({ error: 'Item not found' });
        }
    });
};

// Delete item from the cart
const deleteCartItem = (req, res) => {
    const itemId = req.params.itemId;

    const sql = `DELETE FROM cart WHERE item_id = ?`;

    pool.query(sql, [itemId], (err, result) => {
        if (err) {
            console.error('Error deleting cart item:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Item deleted successfully' });
        } else {
            res.status(400).json({ error: 'Item not found' });
        }
    });
};
// Export functions for use in routes
module.exports = { signupConsumer, addToCart, getCartItems, deleteCartItem, updateCartItem};