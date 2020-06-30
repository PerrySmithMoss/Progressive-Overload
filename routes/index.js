const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const workout = require('../models/workout');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const workouts = await workout.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      user: req.user,
      workouts
    });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

module.exports = router;