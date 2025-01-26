const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const http = require('http');
const socketio = require('socket.io');
const pool = require('./config/configdb');
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');
const sessionMiddleware = require('./middlewares/sessionMiddleware');
const interiorRoutes = require('./routes/interiorRoutes');
const consumerMenuRoutes = require("./routes/consumerMenuRoutes"); // Import consumerMenuRoutes

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

// CORS configuration
const corsOptions = {
    origin: ['https://locationreal.onrender.com', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);


// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// View engine

app.set("public", path.join(__dirname, "public"));
app.set("view engine", "ejs");

const consumerRoutes = require('./routes/consumerRoutes');
app.use('/consumer', consumerRoutes);
app.use('/api/consumer', consumerRoutes);

const riderRoutes = require('./routes/riderRoutes');
app.use('/api/rider', riderRoutes);

const stakeholderRoutes = require('./routes/stakeholderRoutes');
app.use('/api/stakeholder', stakeholderRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/order", orderRoutes);


app.use(sessionMiddleware);
app.use(restaurantRoutes);


app.use('/api/restaurant', require('./routes/restaurantRoutes'));
app.use('/api/menu', menuRoutes);
app.use('/interior', interiorRoutes);



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

// Initialize the HTTP server for Socket.IO
const server = http.createServer(app);
const io = socketio(server);

// Socket.IO logic for real-time location updates
let current_users = {};

io.on('connection', (socket) => {
    console.log("A User connected! user id: " + socket.id);

    socket.on('client-location', (data) => {
        current_users[socket.id] = data.username;
        io.emit('server-location', { ...data, id: socket.id });
    });

    socket.on('client-join-location', (data) => {
        io.emit('client-join-server', { ...data, id: socket.id });
    });

    socket.on('update-cart', (data) => {
        // Broadcast updated cart count to all clients for the specific user
        io.emit(`cart-update-${data.consumerId}`, { cartCount: data.cartCount });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        io.emit('disconnected_user', { id: socket.id, username: current_users[socket.id] });
        delete current_users[socket.id];
    });
});

// Serve static files for map
app.get('/rider/map/', (req, res) => {
    res.sendFile(__dirname + '/public/rider/map.html');
});
app.get('/consumer/map/', (req, res) => {
  res.sendFile(__dirname + '/public/consumer/map.html');
});

app.get('/session-test', (req, res) => {
    if (!req.session.user) {
        req.session.user = { id: 0 };  // Dummy consumer ID for testing
    }
    res.json({ session: req.session });
});
app.set('io', io);



// Set up the server to listen on both HTTP and Socket.IO
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
console.log("Auth routes loaded.");
