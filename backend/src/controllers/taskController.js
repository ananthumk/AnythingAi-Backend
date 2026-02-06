const Task = require("../modal/tasks")

const addTask = async (req, res) => {
    try {
        const { title, description, status, priority } = req.body
        const userId = req.user.id

        // Validation
        if (!title) {
            return res.status(400).json({ message: "Title is required" })
        }

        const task = await Task.create({
            title,
            description,
            status: status || 'pending',
            priority: priority || 'medium',
            createdBy: userId
        })

        res.status(201).json({
            message: "Task added successfully!",
            data: task
        })
    } catch (error) {
        console.log('Add Task: ', error)
        res.status(500).json({ message: 'Server Error' })
    }
}

const getAllTask = async (req, res) => {
    try {
        const userId = req.user.id
        const tasks = await Task.find({ createdBy: userId }).sort({ createdAt: -1 })

        res.status(200).json({ tasks })

    } catch (error) {
        console.log('Get all task: ', error)
        res.status(500).json({ message: "Server Error" })
    }
}

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id
        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        if (task.createdBy.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to view this task" })
        }
        res.status(200).json(task)

    } catch (error) {
        console.log('Get Task by Id: ', error)
        res.status(500).json({ message: "Server Error" })
    }
}

const updateTask = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, priority, status } = req.body
        const userId = req.user.id

        const task = await Task.findById(id)
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        if (task.createdBy.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to update this task" })
        }

        let updates = {}
        if (title) updates.title = title
        if (description !== undefined) updates.description = description
        if (priority) updates.priority = priority
        if (status) updates.status = status

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No fields to update" })
        }

        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true })

        res.status(200).json({
            message: "Task updated successfully",
            data: updatedTask
        })
    } catch (error) {
        console.log('Update a task: ', error)
        res.status(500).json({ message: 'Server Error' })
    }
}

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.id

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        if (task.createdBy.toString() !== userId) {
            return res.status(403).json({ message: "You are not allowed to delete this task" })
        }

        await Task.findByIdAndDelete(id)
        res.status(200).json({ message: "Task deleted successfully" })
    } catch (error) {
        console.log('Delete Task: ', error)
        res.status(500).json({ message: 'Server Error' })
    }
}

// Admin Controllers

const getallTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('createdBy', 'name email').sort({createdAt: -1})
        res.status(200).json({ tasks })
    } catch (error) {
        console.log('Get all tasks - admin: ', error)
        res.status(500).json({ message: "Server Error" })
    }
}

const deleteanyTasks = async (req, res) => {
    try {
        const { id } = req.params

        const task = await Task.findById(id)

        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        await Task.findByIdAndDelete(id)
        res.status(200).json({ message: "Task deleted successfully" })
    } catch (error) {
        console.log('Delete task - admin: ', error)
        res.status(500).json({ message: "Server Error" })
    }
}

module.exports = { addTask, getAllTask, getTaskById, updateTask, deleteTask, getallTasks, deleteanyTasks }