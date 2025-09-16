const express = require('express');
const musicRoutes = require('./music.route');

const router = express.Router();


router.use('/music', musicRoutes);
// router.use('/user', userRoutes); // other routes for the futur

module.exports = router;