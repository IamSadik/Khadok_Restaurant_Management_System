
const bcrypt = require('bcrypt');
const { createRider } = require('../models/riderModel');

const signupRider = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await createRider(name, email, hashedPassword);
        res.status(201).json({ message: 'Rider registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering rider' });
    }
};

module.exports = { signupRider };

const { getRiderByEmail } = require('../models/authModel');

exports.loginRider = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate rider credentials
        const rider = await getRiderByEmail(email);

        if (rider && rider.password === password) {
            res.send("Login successful!");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        console.error('Error during Rider login:', error);
        res.status(500).send("Server error");
    }
};

