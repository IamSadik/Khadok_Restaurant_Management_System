
const bcrypt = require('bcrypt');
const { createConsumer, getMaxConsumerId } = require('../models/consumerModel');
const db = require('../config/configdb');
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
    const { name, email, password, phone_number } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Fetch the highest consumer_id
        const maxId = await getMaxConsumerId();
        const newConsumerId = maxId !== null ? maxId + 1 : 0;

        // Insert the new consumer into the database
        await createConsumer(newConsumerId, name, email, hashedPassword, phone_number);

        res.status(201).json({ message: 'Consumer registered successfully', consumer_id: newConsumerId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering consumer' });
    }
};


// Add item to cart handler
const addToCart = (req, res) => {
    const { item_id, item_name, stakeholder_id } = req.body;
    const consumer_id = req.session.user.id;  // Fetching logged-in consumer ID from session
   
    const quantity = 1;  // Default quantity
    const timestamp = new Date();  // Current timestamp

    const query = `
        INSERT INTO cart (consumer_id, item_id, quantity, added_at, updated_at, stakeholder_id, item_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [consumer_id, item_id, quantity, timestamp, timestamp, stakeholder_id, item_name], (error, results) => {
        if (error) {
            console.error('Error adding item to cart:', error);
            return res.status(500).json({ success: false, message: 'Failed to add item to cart' });
        }
        res.status(200).json({ success: true, message: 'Item added to cart successfully' });
    });
};
// Export functions for use in routes
module.exports = { signupConsumer, addToCart };