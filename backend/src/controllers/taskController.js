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
        const { status, priority, search, page } = req.query
        const pageNumber = parseInt(page) || 1
        const limit = 6
        const skip = (pageNumber - 1) * limit

        // Build the filter with user's own tasks only
        const filter = { createdBy: req.user.id }
        if (status) filter.status = status
        if (priority) filter.priority = priority

        // Add search to filter if provided
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }

        // Count total tasks matching filter
        const totalTasks = await Task.countDocuments(filter)

        // Fetch tasks with pagination, search, and filter
        const tasks = await Task.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })

        return res.status(200).json({ 
            tasks, 
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: pageNumber,
            totalTasks
        })
    } catch (error) {
        console.log('Get Tasks Error:', error.message)
        return res.status(500).json({ message: 'Internal Server Error', error: error.message })
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
        const { status, priority, search, page } = req.query
        const pageNumber = parseInt(page) || 1
        const limit = 6
        const skip = (pageNumber - 1) * limit

        // Build the filter
        const filter = {}
        if (status) filter.status = status
        if (priority) filter.priority = priority

        // Add search to filter if provided
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ]
        }

        // Count total tasks matching filter
        const totalTasks = await Task.countDocuments(filter)

        // Fetch tasks with pagination, search, and filter
        const tasks = await Task.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id', 
                    as: 'createdBy'
                }
            },
            { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    status: 1,
                    priority: 1,
                    createdAt: 1,
                    dueDate: 1,
                    createdBy: {
                        _id: "$createdBy._id",
                        name: "$createdBy.name",
                        email: "$createdBy.email"
                    }
                }
            }
        ])

        res.status(200).json({ 
            tasks, 
            totalPages: Math.ceil(totalTasks / limit),
            currentPage: pageNumber,
            totalTasks
        })
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