const express = require('express');
const router = express.Router();
const { ensureAuthenticated} = require('../config/auth');

const workout = require('../models/workout');


// Welcome Page
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('workouts/add')
});

module.exports = router;