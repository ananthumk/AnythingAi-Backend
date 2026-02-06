const express = require('express')
const { authenticate, authorizeRole } = require('../middlleware/authMiddleware')
const { addTask, getAllTask, getTaskById, updateTask, deleteTask, deleteanyTasks, getallTasks } = require('../controllers/taskController.js')
const { validate } = require('../validators/validate.js')
const { addTaskSchema, updateTaskSchema } = require('../validators/taskValidator.js')
const taskRoutes = express.Router()

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project documentation
 *               description:
 *                 type: string
 *                 example: Write comprehensive API docs
 *               status:
 *                 type: string
 *                 enum: [pending, in progress, completed]
 *                 example: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
taskRoutes.post('/', authenticate, authorizeRole('user'), validate(addTaskSchema), addTask)

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
taskRoutes.get('/', authenticate, authorizeRole('user'), getAllTask)

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 *       403:
 *         description: Unauthorized to view this task
 */
taskRoutes.get('/:id', authenticate, authorizeRole('user'), getTaskById)

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in progress, completed]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */
taskRoutes.patch('/:id', authenticate, authorizeRole('user'), validate(updateTaskSchema), updateTask)

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
taskRoutes.delete('/:id', authenticate, authorizeRole('user'), deleteTask)

/**
 * @swagger
 * /admin/tasks:
 *   get:
 *     summary: Get all tasks (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks in the system
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [pending, in progress, completed]
 *                       priority:
 *                         type: string
 *                         enum: [low, medium, high]
 *                       createdBy:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - User is not an admin
 */
taskRoutes.get('/admin/tasks', authenticate, authorizeRole('admin'), getallTasks)

/**
 * @swagger
 * /admin/tasks/{id}:
 *   delete:
 *     summary: Delete any task (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID to delete
 *     responses:
 *       200:
 *         description: Task deleted successfully by admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Task not found
 *       401:
 *         description: Unauthorized - No token provided
 *       403:
 *         description: Forbidden - User is not an admin
 */
taskRoutes.delete('/admin/tasks/:id', authenticate, authorizeRole('admin'), deleteanyTasks)

module.exports = taskRoutes