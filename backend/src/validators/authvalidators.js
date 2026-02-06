const {z} = require('zod')

const registerSchema = z.object({
    name: z.string().min(3, "Name must be atleast 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password should be atleast 8 characters"),
    role: z.enum(['user', 'admin'])
})

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
})

module.exports = { registerSchema, loginSchema}