const Task = require('../models/taskModel');

// Get all tasks (supports archived filter)
exports.getAllTasks = async (req, res) => {
  try {
    const archived = req.query.archived === 'true';
    const tasks = await Task.find({ archived }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Archive (soft delete) a task
exports.archiveTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { archived: true }, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task archived' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Hard delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};