// config/config.js
require('dotenv').config();  // Load environment variables from .env file

module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  USER: process.env.USER || 'root',
  PASSWORD: process.env.PASSWORD || '',
  DB_PORT: process.env.DB_PORT || 3306,
  DATABASE: process.env.DATABASE || 'khadok'
};
