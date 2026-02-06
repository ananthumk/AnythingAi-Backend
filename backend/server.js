const express = require('express')
const db = require('./src/config/db')
require('dotenv').config()
const cors = require('cors')
const userRoutes = require('./src/routes/userRoutes')
const taskRoutes = require('./src/routes/taskRoutes')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');


const app = express()

app.use(cors({
  origin: 'https://anything-ai-backend.vercel.app/',
  credentials: true
}))
app.use(express.json())

// Connect to Database
db()

// API ROUTES
app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/task', taskRoutes)

//Swagger API 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({ message: 'Internal Server Error' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))