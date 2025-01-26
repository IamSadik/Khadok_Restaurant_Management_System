const bcrypt = require('bcrypt');
const { getUniqueStakeholderId, createStakeholder, getLocationById } = require('../models/stakeholderModel');

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


// Controller to fetch stakeholder location by ID
const getStakeholderLocation = async (req, res) => {
    const stakeholderId = req.params.stakeholderId;

    try {
        const location = await getLocationById(stakeholderId);
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).json({ error: "Location not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { signupStakeholder , getStakeholderLocation};
