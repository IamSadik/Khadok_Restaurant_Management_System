const { getConsumerByEmail, getStakeholderByEmail, getRiderByEmail} = require('../models/authModel');

//const bcrypt = require('bcrypt');


// Variables to store logged-in emails
let consumerEmail = null;
let stakeholderEmail = null;


exports.loginConsumer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const consumer = await getConsumerByEmail(email);

        if (!consumer) {
            return res.status(404).send('Consumer not found');
        }


        // Directly compare passwords since they are not hashed
        if (password !== consumer.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
          // Simulate successful authentication
        if (email) {
            consumerEmail = email; // Store consumer email
           
        }

        // redirect to dashboard
        res.redirect('/consumer/khadok.consumer.dashboard.html');
    } catch (error) {
        console.error('Error in consumer login:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.loginStakeholder = async (req, res) => {
    const { email, password } = req.body;
    try {
        const stakeholder = await getStakeholderByEmail(email);
        if (!stakeholder) {
            return res.status(404).json({ message: 'Stakeholder not found' });
        }

        // Directly compare passwords since they are not hashed
        if (password !== stakeholder.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (email) {
            stakeholderEmail = email; // Store stakeholder email
            
        }
       
         // redirect to dashboard
         res.redirect('/stakeholder/khadok.stakeholder.index.html');
    } catch (error) {
        console.error('Error in stakeholder login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.loginRider = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch Rider by email
        const rider = await getRiderByEmail(email);

        // Check if Rider exists
        if (!rider) {
            return res.status(404).json({ message: 'Rider not found' });
        }

        // Directly compare passwords since they are not hashed
        if (password !== rider.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Store Rider email (if necessary)
        if (email) {
            riderEmail = email; // Store Rider email for session or other uses
        }

        // Redirect to Rider dashboard
        res.redirect('/rider/index.html');
    } catch (error) {
        console.error('Error in Rider login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



// Logout Handler
exports.logout = (req, res) => {
    // Clear the logged-in email based on user type
    const userType = req.query.type; // Assume type is passed as a query parameter (e.g., /auth/logout?type=consumer)

    if (userType === 'consumer') {
        consumerEmail = null; // Clear consumer email
    } else  {
        stakeholderEmail = null; // Clear stakeholder email
    }

    res.status(200).json({ message: 'Logout successful' });
};




// Get Email Endpoint
exports.getEmail = (req, res) => {
    const userType = req.query.type; // Assume type is passed as a query parameter (e.g., /auth/email?type=consumer)

    if (userType === 'consumer') {
        return res.status(200).json({ email: consumerEmail });
    } else if (userType === 'stakeholder') {
        return res.status(200).json({ email: stakeholderEmail });
    }

    res.status(400).json({ message: 'Invalid user type' });
};

exports.logoutHandler = (req, res) => {
    // Simply return a success response with the redirect URL
    res.json({
        message: 'Logout successful!',
        redirectURL: '../login.html', // URL for your dedicated logout page
    });
};
