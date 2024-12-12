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
