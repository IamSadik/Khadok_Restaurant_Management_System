

<!-- ========================= -->
<!--        HERO SECTION       -->
<!-- ========================= -->

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Poppins&size=30&duration=3000&pause=1000&color=00C2FF&center=true&vCenter=true&width=900&lines=🍽️+Khadok;Smart+Food+Delivery+%7C+Pickup+%7C+Dine-In+Platform;Built+for+the+Future+of+Restaurants+in+Bangladesh" />
</p>
🌐 Live Demo

🚀 Experience the live frontend deployment of **Khadok – Smart Food Delivery, Pickup & Dine-In Platform**

<p align="center">
  <a href="https://khadok-restaurant-management-system.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🔗 Live Demo-Visit Website-00C2FF?style=for-the-badge" />
  </a>
</p>


> *Note: This deployment showcases the frontend UI/UX of the platform. Backend services such as Node.js APIs, MySQL database operations, authentication, and real-time features require separate server deployment.*
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-success?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/Express.js-Framework-black?style=for-the-badge&logo=express">
  <img src="https://img.shields.io/badge/MySQL-Database-blue?style=for-the-badge&logo=mysql">
  <img src="https://img.shields.io/badge/Socket.io-RealTime-orange?style=for-the-badge&logo=socket.io">
  <img src="https://img.shields.io/badge/bKash-Payment-E2136E?style=for-the-badge">
</p>

<p align="center">
  <b>Khadok</b> is a next-generation food ordering ecosystem connecting 
  <b>Consumers</b>, <b>Restaurant Owners</b>, <b>Riders</b>, and <b>Admins</b> 
  in one powerful platform.
</p>

<p align="center">
  Delivery • Pickup • Dine-In • Real-Time Tracking • 3D Restaurant Tours • AI Recommendations
</p>

---

# 🍽️ Khadok – Smart Food Delivery, Pickup & Dine-In Platform
 

## 🚀 Project Overview

**Khadok** is a full-featured smart food delivery and restaurant management platform designed specifically for the Bangladesh market.

It transforms traditional food ordering into a seamless digital ecosystem where users can:

- Discover nearby restaurants using live maps
- Place delivery or pickup orders
- Reserve dine-in tables
- Explore restaurants through immersive 360° previews
- Pay securely using bKash
- Receive live tracking and notifications

Unlike conventional food delivery platforms, Khadok introduces:

✨ **3D Interior Restaurant Tours**  
✨ **AI-Based Smart Recommendations**  
✨ **Real-Time Logistics Tracking**  
✨ **Advanced Multi-Role Management System**

---

# 🎯 Core User Roles

| Role | Responsibilities |
|---|---|
| 👤 Consumer | Browse restaurants, order food, book tables, payment |
| 🏪 Stakeholder | Restaurant owner dashboard, menu management, pricing |
| 🛵 Rider | Delivery management, route optimization, performance tracking |
| 🛡️ Admin | Full system control, analytics, auditing, compliance |

---

# 🔥 Key Features

---

## 🗺️ 1. Map-Based Discovery & Smart Routing
<img width="1913" height="917" alt="Capture" src="https://github.com/user-attachments/assets/735024f2-5732-4154-a5e2-97d2fb0fe298" />
### 📍 MapTiler + Leaflet.js

- Interactive custom-styled maps
- Auto-detect consumer location
- Nearby restaurant clustering
- Mobile + desktop optimized experience

### 🚗 OSRM Route Optimization

- Real-world delivery route calculation
- Live ETA estimation
- Dynamic “restaurants within 10 mins” zones

### 📡 Geofencing

- Smart pickup zone detection
- Rider-triggered order-ready alerts
- Improved delivery coordination

---

## ⚡ 2. Real-Time Order Flow

### 🔄 Socket.io Integration

- Live order status updates

Preparing → Packed → En Route → Delivered


* Real-time rider tracking
* Consumer ↔ Rider instant communication

### 🔔 Push Notifications

* Browser notifications via Service Workers
* Works even when browser tab is closed

### 📩 SMS Alerts via bKash API

* Payment confirmation messages
* Delivery arrival notifications

---

## 🏛️ 3. 3D Interior Restaurant Preview

### 🌐 Panolens.js
<img width="1912" height="911" alt="Capture1" src="https://github.com/user-attachments/assets/7c971454-5564-497c-b6f8-5836771db25b" />
* 360° panoramic restaurant tours
* Virtual dine-in experience before booking

### 🪑 Three.js

* Interactive 3D table layouts
* Real-time table selection system

This creates a premium dine-in booking experience.

---

## 💳 4. Payments & Invoicing

### 💸 bKash Checkout Integration

* Secure mobile wallet payments
* Transaction verification
* Webhook payment confirmation
* Automatic payment logging

### 🧾 PDF Invoice Generation

Using **PDFKit**

* Instant receipt generation
* Downloadable invoices
* Email invoice delivery via SMTP / SendGrid

---

## 🤖 5. AI-Driven Recommendations & Smart Search

### 🔍 Full-Text Search Engine

Powered by:

* MySQL InnoDB Search
* Hit Highlighting
* Smart Autocomplete

Users can instantly find:

* Restaurants
* Menu items
* Reviews
* Popular dishes

### ⚡ Redis Cache Layer

* Cached top-selling menus
* Popular search optimization
* Reduced database load
* Faster user experience

---

## 📊 6. Role-Based Dashboards & Analytics

### 👤 Consumer Dashboard

* Order history
* Saved favorites
* Payment methods
* Booking records

### 🏪 Stakeholder Dashboard

* Live sales analytics
* Best-selling menu insights
* Table occupancy heatmap
* Revenue monitoring

### 🛵 Rider Dashboard

* Delivery performance
* Average delivery time
* Distance covered
* On-time completion rate

### 🛡️ Admin Dashboard

* Revenue trends
* Active sessions
* User growth analytics
* System health monitoring
* Session-level access control

---

## 🔐 7. Security & Compliance

### 🛡️ Enterprise-Level Protection

* bcrypt password hashing
* Helmet.js security middleware
* Content Security Policy (CSP)
* XSS prevention
* Clickjacking prevention

### 🔒 Secure Database Communication

* MySQL with TLS encryption

### 🧠 Session Management

* MySQL-backed session storage
* Individual session logout
* Session expiry control
* Advanced audit tracking

---

# 🛠️ Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Frontend       | HTML5, CSS3, Vanilla JavaScript |
| Backend        | Node.js, Express.js             |
| Database       | MySQL                           |
| Cache Layer    | Redis                           |
| Mapping        | MapTiler, Leaflet.js, OSRM      |
| 3D Tours       | Panolens.js, Three.js           |
| Real-Time      | Socket.io                       |
| Authentication | express-session                 |
| Payments       | bKash API                       |
| File Uploads   | Multer                          |
| PDF Generation | PDFKit                          |
| Email Services | SendGrid / SMTP                 |
| Environment    | dotenv                          |

---

# 📦 Installation & Setup

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/IamSadik/Khadok_Restaurant_Management_System.git
```

---

## 2️⃣ Navigate to Project Folder

```bash
cd khadok
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

HOST=your_database_host
USER=your_database_user
PASSWORD=your_database_password
DB_PORT=your_database_port
DATABASE=your_database_name

SESSION_SECRET=your_session_secret
SESSION_NAME=your_session_name
SESSION_LIFETIME=your_session_lifetime_in_ms

BKASH_API_KEY=your_bkash_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
MAPTILER_API_KEY=your_maptiler_api_key
```

---

## 5️⃣ Start Development Server

```bash
npm start
```

---

# 🌟 Why Khadok?

Khadok is not just another food delivery platform.

It is a complete restaurant technology ecosystem built for:

### Better User Experience

### Better Restaurant Operations

### Better Delivery Management

### Better Business Intelligence

Designed with scalability, real-time performance, and premium customer experience at its core.

---

# 👨‍💻 Developed By

### Team KA/YO

Software Engineering Student
Full Stack Developer
UI/UX Designer
Problem Solver

---

<p align="center">
  ⭐ If you like this project, don't forget to give it a star!
</p>
```
