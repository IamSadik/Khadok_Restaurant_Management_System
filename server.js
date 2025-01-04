const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const pool = require('./config/configdb');
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const sessionMiddleware = require('./middlewares/sessionMiddleware');


// Initialize dotenv for environment variables
dotenv.config();

const app = express();

// MySQL Session Store
const sessionStore = new MySQLStore({}, pool);

// Session Middleware
app.use(session({
    key: 'session_cookie_name',
    secret: 'yourSecretKey',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Use `true` if you're using HTTPS
}));



// Session Middleware
app.use(session({
  secret: 'yourSecretKey',  // This is a secret key used to encrypt the session (change this to something random)
  resave: false,  // Don't resave the session if it's not modified
  saveUninitialized: true,  // Save a session even if it hasn't been modified
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true
}
}));




// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true // Allow cookies to be sent with requests
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// View engine
app.set("public", path.join(__dirname, "public"));
app.set("view engine", "ejs");
const consumerRoutes = require('./routes/consumerRoutes');
app.use('/', consumerRoutes);

const riderRoutes = require('./routes/riderRoutes');
app.use('/api/rider', riderRoutes);
const stakeholderRoutes = require('./routes/stakeholderRoutes');
app.use('/api/stakeholder', stakeholderRoutes);
const adminRoutes = require("./routes/adminRoutes");

app.use("/admin", adminRoutes);
app.use(sessionMiddleware);




// Use the restaurant routes
app.use(restaurantRoutes);

// Routes
//app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/consumer', require('./routes/consumerRoutes'));
app.use('/api/restaurant', require('./routes/restaurantRoutes'));
app.use('/api/menu', menuRoutes);

//app.use('/api/rider', require('./routes/riderRoutes'));
//app.use('/api/order', require('./routes/orderRoutes'));


// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Khadok Food Delivery!');
});



// Database connection check
pool.getConnection((err) => {
  if (err) {
      console.error("Database connection failed:", err);
      process.exit(1);
  } else {
      console.log("Database connected!");
  }
});

// Set up the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
console.log("Auth routes loaded.");
