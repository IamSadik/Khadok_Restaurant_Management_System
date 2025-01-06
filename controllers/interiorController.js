const { addTableToDB, uploadImageToDB, getImageFromDB, removeTableFromDB } = require('../models/interiorModel');
const { fetchTableInfoFromDB } = require('../models/interiorModel');
const { deleteImageFromDB } = require("../models/interiorModel");

// Add tables to database (Controller)
exports.addTables = (req, res) => {
    const { tables } = req.body; // Expecting an array of table objects
    const stakeholderId = req.session.user.id;

    let errorOccurred = false;

    tables.forEach(({ tableType, tableCount }) => {
        addTableToDB(stakeholderId, tableType, tableCount, (err) => {
            if (err) {
                errorOccurred = true;
                return; // If one table fails, stop further execution
            }
        });
    });

    if (errorOccurred) {
        return res.status(500).json({ success: false, message: 'Failed to add some tables.' });
    }

    res.status(200).json({ success: true, message: 'Tables added/updated successfully!' });
};

const path = require("path");
const { checkExistingImage } = require("../models/interiorModel");

// Upload 360 image
exports.uploadImage = async (req, res) => {
    try {
        const stakeholderId = req.session.user.id;

        // Check if an image already exists for this stakeholder
        const existingImage = await checkExistingImage(stakeholderId);
        if (existingImage) {
            return res.status(400).json({ success: false, message: "You can upload only one 360 image." });
        }

        // Extract the filename
        const fileName = path.basename(req.file.path);

        // Insert the new image into the database
        await uploadImageToDB(stakeholderId, fileName, (err, result) => {
            if (err) throw err;
            res.status(200).json({ success: true, message: "Image uploaded successfully!" });
        });
    } catch (error) {
        console.error("Error during image upload:", error);
        res.status(500).json({ success: false, message: "Failed to upload image." });
    }
};

// Delete 360 image
exports.deleteImage = async (req, res) => {
    try {
        const stakeholderId = req.session.user.id;

        // Delete the image from the database
        await deleteImageFromDB(stakeholderId);
        res.status(200).json({ success: true, message: "360 view deleted successfully!" });
    } catch (error) {
        console.error("Error deleting 360 view:", error);
        res.status(500).json({ success: false, message: "Failed to delete 360 view." });
    }
};

// Get 360 image
exports.getInteriorImage = async (req, res) => {
    try {
        const stakeholderId = req.session.user.id; // Get logged-in stakeholder ID
        const image = await getImageFromDB(stakeholderId); // Fetch the image from the DB

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found.' });
        }

        // Return the image URL (assumes you're serving static files from 'uploads')
        const imageUrl = `/uploads/${image}`;
        console.log('Image URL:', imageUrl);

        res.status(200).json({ success: true, imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch image.' });
    }
};
//Remove tables
exports.removeTables = (req, res) => {
    const { removeTableType, removeTableCount } = req.body; 
    const stakeholderId = req.session.user.id;

    removeTableFromDB(stakeholderId, removeTableType, removeTableCount, (err, result) => {
        if (err) {
            console.error('Error removing tables:', err);
            return res.status(500).json({ success: false, message: 'Failed to remove tables.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No tables found to update.' });
        }

        res.status(200).json({ success: true, message: 'Tables removed successfully!' });
    });
};


// Controller function to fetch table info
exports.getTableInfo = (req, res) => {
    // Validate session and fetch stakeholder ID
    const stakeholderId = req.session?.user?.id;

    if (!stakeholderId) {
        console.error('Unauthorized access: No stakeholder ID in session.');
        return res.status(401).json({ success: false, error: 'Unauthorized access' });
    }

    // Fetch table data from model
    fetchTableInfoFromDB(stakeholderId, (err, tableData) => {
        if (err) {
            console.error('Error fetching table data:', err);
            return res.status(500).json({ success: false, error: 'Server error' });
        }

        res.status(200).json({ success: true, data: tableData || {} });
    });
};
