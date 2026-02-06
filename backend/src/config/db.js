const mongoose = require('mongoose');

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log('Connection Error: ', error)
        process.exit(1)
    } 
}

module.exports = db
