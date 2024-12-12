const { getConsumerByEmail, getStakeholderByEmail, getRiderByEmail } = require('../models/authModel');
//const bcrypt = require('bcrypt');

exports.loginConsumer = async (req, res) => {
    const { email, password } = req.body;
    try {
        const consumer = await getConsumerByEmail(email);
        if (!consumer) {
            return res.status(404).send('Consumer not found');
        }

        // Directly compare passwords since they are not hashed
        if (password !== consumer.password) {
            return res.status(401).send('Invalid email or password');
        }

        // Redirect to home.html on successful login
        res.redirect('/consumer/khadok.consumer.dashboard.html');

    } catch (error) {
        console.error('Error in consumer login:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.loginStakeholder = async (req, res) => {
    const { email, password } = req.body;
    try {
        const stakeholder = await getStakeholderByEmail(email);
        if (!stakeholder) {
            return res.status(404).json({ message: 'Stakeholder not found' });
        }

        // Directly compare passwords since they are not hashed
        if (password !== stakeholder.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If login successful, redirect to stakeholder dashboard
        res.status(200).json({ redirectURL: '/stakeholder/dashboard' });
    } catch (error) {
        console.error('Error in stakeholder login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.loginRider = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch Rider by email
        const rider = await getRiderByEmail(email);

        // Check if Rider exists
        if (!rider) {
            return res.status(404).json({ message: 'Rider not found' });
        }

        // Directly compare passwords since they are not hashed
        if (password !== rider.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If login is successful, redirect to Rider dashboard
        res.status(200).json({ redirectURL: '/rider/dashboard' });
    } catch (error) {
        console.error('Error in Rider login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
