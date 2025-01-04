const bcrypt = require('bcrypt');
const { getUniqueStakeholderId, createStakeholder } = require('../models/stakeholderModel');

const signupStakeholder = async (req, res) => {
    const { name, email, password, restaurant_name } = req.body;

    try {
        // Generate unique stakeholder_id
        const stakeholderId = await getUniqueStakeholderId();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert stakeholder into database
        await createStakeholder(stakeholderId, name, email, hashedPassword, restaurant_name);

        res.status(201).json({ message: 'Stakeholder registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering stakeholder' });
    }
};

module.exports = { signupStakeholder };
