const { getConsumerByEmail, getStakeholderByEmail, getRiderByEmail} = require('../models/authModel');

const bcrypt = require('bcrypt');


// Variables to store logged-in emails
let consumerEmail = null;
let stakeholderEmail = null;

exports.loginConsumer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const consumer = await getConsumerByEmail(email);

        if (!consumer) {
            return res.status(404).json({ message: 'Consumer not found' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, consumer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Store consumer email (if necessary)
        if (email) {
            consumerEmail = email; // You may want to use session management instead
        }
        // Save user details in the session
        req.session.user = { id: consumer.consumer_id, email: consumer.email, type: 'consumer' };
        console.log('Session data:', req.session.user); // Debugging
        // Redirect to dashboard
        res.redirect('/consumer/khadok.consumer.dashboard.html');
    } catch (error) {
        console.error('Error in consumer login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.loginStakeholder = async (req, res) => {
    const { email, password } = req.body;

    try {
        const stakeholder = await getStakeholderByEmail(email);
        if (!stakeholder) {
            return res.status(404).json({ message: 'Stakeholder not found' });
        }
        
        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, stakeholder.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

       
        req.session.user = { id: stakeholder.stakeholder_id, email: stakeholder.email, type: 'stakeholder' };

        console.log('Session data:', req.session.user); // Debugging
              
        // Redirect to dashboard
        res.redirect('/stakeholder/khadok.stakeholder.index.html', );
        
    } catch (error) {
        console.error('Error in stakeholder login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.loginRider = async (req, res) => {
    const { email, password } = req.body;

    try {
        const rider = await getRiderByEmail(email);

        if (!rider) {
            return res.status(404).json({ message: 'Rider not found' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, rider.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        req.session.user = { id: rider.rider_id, email: rider.email, type: 'rider' };

        console.log('Session data:', req.session.user); // Debugging


        // Redirect to Rider dashboard
        res.redirect('/rider/index.html');
    } catch (error) {
        console.error('Error in Rider login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Failed to logout' });
        }

        res.clearCookie('session_cookie_name');
        res.status(200).json({ message: 'Logout successful' });
    });
};
exports.getStakeholderId = async (req, res) => {
    try {
        if (!stakeholderEmail) {
            return res.status(401).json({ message: 'No stakeholder logged in' });
        }

        const stakeholder = await getStakeholderByEmail(stakeholderEmail);
        if (!stakeholder) {
            return res.status(404).json({ message: 'Stakeholder not found' });
        }

        res.status(200).json({ stakeholder_id: stakeholder.stakeholder_id });
    } catch (error) {
        console.error('Error fetching stakeholder ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



// Get Email Endpoint
exports.getEmail = (req, res) => {
    if (req.session.user) {
        res.status(200).json({ email: req.session.user.email });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
};

exports.logoutHandler = (req, res) => {
    const userType = req.query.type;

    if (userType === 'consumer') {
        req.session.consumer = null;  // Clear consumer session data
    } else if (userType === 'stakeholder') {
        req.session.stakeholder = null;  // Clear stakeholder session data
    }

    res.status(200).json({ message: 'Logout successful' });
};



