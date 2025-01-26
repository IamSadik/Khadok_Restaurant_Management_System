const { getAdminByEmail } = require("../models/adminModel");

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch admin by email
        const admin = await getAdminByEmail(email);

        // Check if admin exists
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Directly compare entered password with the database password
        if (password !== admin.password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Successful login - Redirect to admin dashboard
        return res.redirect('/admin/index.html'); // Ensure this path matches your actual file structure
    } catch (error) {
        console.error("Error in Admin login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const { fetchConsumers } = require('../models/adminModel');

// Controller to get consumers
const getConsumers = async (req, res) => {
    try {
        const consumers = await fetchConsumers(); // Call the model function to fetch consumers
        res.json({ consumers }); // Send the data as JSON
    } catch (error) {
        console.error('Error fetching consumers:', error);
        res.status(500).json({ error: 'Failed to fetch consumers' });
    }
};


const { markConsumerAsDeleted } = require("../models/adminModel");

// Controller to delete a consumer
const deleteConsumer = async (req, res) => {
    const consumerId = req.params.id;

    try {
        await markConsumerAsDeleted(consumerId);
        res.status(200).json({ message: "Consumer deleted successfully." });
    } catch (error) {
        console.error("Error deleting consumer:", error);
        res.status(500).json({ error: "Failed to delete consumer." });
    }
};

module.exports = { loginAdmin, getConsumers, deleteConsumer };

