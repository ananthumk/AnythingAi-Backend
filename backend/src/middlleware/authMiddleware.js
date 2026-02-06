const jwt = require('jsonwebtoken')

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({message: "No token provided"})
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({message: "Invalid token format"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({message: "Invalid Token"})
    }
}

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({message: "Access Denied"})
        }
        next()
    }
}

module.exports = { authenticate, authorizeRole }