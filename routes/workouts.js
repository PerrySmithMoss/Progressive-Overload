const express = require('express');
const router = express.Router();
const { ensureAuthenticated} = require('../config/auth');

const workout = require('../models/workout');


// Add workout page 
// GET /workouts/add
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('workouts/add')
});

// Process add workout form 
// POST /workouts
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        req.body.user = req.user.id
        await workout.create(req.body)
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error)
        res.render('error/500');
    }
});

// Show all workouts 
// GET /workouts
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const workouts = await workout.find({ status: 'public'})
        .populate('user')
        .lean()

    res.render('workouts/index', {
        user: req.user,
        workouts,
    })
    } catch (error) {
        console.error(error) 
        res.render('error/500')
    }
});

// Show single workout
// GET /workouts/:id
router.get('/:id', ensureAuthenticated, async (req, res) => {
    try {
      let workouts = await workout.findById(req.params.id).populate('user').lean()
  
      if (!workouts) {
        return res.render('error/404')
      }
  
      res.render('workouts/show', {
        workouts,
      })
    } catch (error) {
      console.error(error)
      res.render('error/404')
    }
  })

// Show edit workout page 
// GET /workouts/edit/:id
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    // const workout was causing initilization error 
    const workouts = await workout.findOne({
        _id: req.params.id,
    }).lean()

    if (!workouts) {
        return res.render('error/404')
    }

    if (workouts.user != req.user.id) {
        res.redirect('/workouts')
    } else {
        res.render('workouts/edit', {
            workouts,
        })
    }
    } 
);

// Update workout 
// PUT /workouts/:id
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
    let workouts = await workout.findById(req.params.id).lean()

    if (!workouts) {
        return res.render('error/404')
    }

    if (workouts.user != req.user.id) {
        res.redirect('/workouts')
    } else {
        workouts = await workout.findOneAndUpdate({_id: req.params.id}, req.body, {
            new: true, 
            runValidators: true
        })
        res.redirect('/dashboard')
        } 
    } catch (error) {
    console.error(error)
    }
});

// Delete story
// DELETE /workouts/:id
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await workout.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
      console.error(error)
      return res.render('error/500')
    }
})

// User workouts
// GET /workouts/user/:userId
router.get('/user/:userId', ensureAuthenticated, async (req, res) => {
    try {
      const workouts = await workout.find({
        user: req.params.userId,
        status: 'public',
      })
        .populate('user')
        .lean()
  
      res.render('workouts/index', {
        workouts,
      })
    } catch (error) {
      console.error(error)
      res.render('error/500')
    }
  })

module.exports = router;