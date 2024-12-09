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
