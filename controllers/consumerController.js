exports.loginHandler = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Validate user credentials (example: database query)
        const user = await User.findOne({ username });
        if (user && user.password === password) {
            res.send("Login successful!");
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};



  