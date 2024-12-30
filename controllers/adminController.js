const { getAdminByEmail } = require("../models/adminModel");

exports.loginAdmin = async (req, res) => {
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
