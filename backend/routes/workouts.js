const express = require('express')
const {
    createWorkout,
} = require('../controllers/workoutController')
const router = express.Router()

//GET all workouts
router.get('/', (req, res) => {
    res.json({mssg: 'GET all workouts'})
})

//GET a single workout
router.get('/:id', (req, res) =>{
    res.json({mssg: 'GET a single workout'})
})

//POST a new workout
router.post('/', createWorkout)

//DELETE a new workout
router.delete('/', (req, res) => {
    res.json({mssg: 'DELETE a new workout'})
})

//DELETE a new workout
router.patch('/:id', (req, res) => {
    res.json({mssg: 'PATCH a new workout'})
})

module.exports = router