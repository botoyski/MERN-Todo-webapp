const express = require('express');
const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  archiveTask,
  deleteTask
} = require('../controllers/taskController');
const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.patch('/:id/archive', archiveTask); // Soft delete
router.delete('/:id', deleteTask); // Hard delete

module.exports = router;