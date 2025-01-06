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



const { getCustomerNameFromDB } = require('../models/consumerModel');

const getNames = async (req, res) => {
    try {
        const restaurants = await getCustomerNameFromDB();
        res.json(restaurants);
    } catch (error) {
        console.error('Error fetching top-rated restaurants:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const bcrypt = require('bcrypt');
const { createConsumer, getMaxConsumerId } = require('../models/consumerModel');

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

module.exports = { signupConsumer, getNames };

