const Workout = require('../models/workoutModel')

// Get all workouts
const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 })
    res.status(200).json(workouts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get a single workout
const getSingleWorkout = async (req, res) => {
  const { id } = req.params
  try {
    const workout = await Workout.findById(id)
    if (!workout) return res.status(404).json({ error: 'Workout not found' })
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Create a new workout
const createWorkout = async (req, res) => {
  const { title, reps, load } = req.body
  try {
    const workout = await Workout.create({ title, reps, load })
    res.status(201).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params
  try {
    const workout = await Workout.findByIdAndDelete(id)
    if (!workout) return res.status(404).json({ error: 'Workout not found' })
    res.json({ message: 'Workout deleted' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params
  try {
    const workout = await Workout.findByIdAndUpdate(id, req.body, { new: true })
    if (!workout) return res.status(404).json({ error: 'Workout not found' })
    res.json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getAllWorkouts,
  getSingleWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}