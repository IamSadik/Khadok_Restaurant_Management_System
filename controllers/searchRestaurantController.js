// controllers/searchRestaurantController.js

const db = require("../config/connectdb");

// Search restaurants based on query
exports.searchRestaurants = async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ message: "Query parameter is missing" });
    }

    try {
        const [results] = await db.execute(
            "SELECT stakeholder_id, restaurant_name FROM stakeholder WHERE restaurant_name LIKE ?",
            [`%${query}%`]
        );

        if (results.length > 0) {
            res.json(results);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
