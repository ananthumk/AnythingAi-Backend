const {z} = require('zod')

const addTaskSchema = z.object({
    title: z.string().min(3, 'Title must be atleast 3 characters'),
    description: z.string().optional(),
    status: z.enum(['pending', 'in progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional()
})

const updateTaskSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['pending', 'in progress', 'completed']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional()
})

module.exports = { addTaskSchema, updateTaskSchema}