const bcrypt = require('bcrypt');
const { getUniqueRiderId, createRider } = require('../models/riderModel');

const signupRider = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Generate unique rider_id
        const riderId = await getUniqueRiderId();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert rider into database
        await createRider(riderId, name, email, hashedPassword);

        res.status(201).json({ message: 'Rider registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering rider' });
    }
};

module.exports = { signupRider };
