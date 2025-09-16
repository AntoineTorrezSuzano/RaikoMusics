const express = require('express');
const allRoutes = require('./routes'); // this will import src/routes/index.js
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());

// Main router for all API endpoints
app.use('/api', allRoutes);

// Global error handling middleware (must be the last app.use)
app.use(errorHandler);

module.exports = app;