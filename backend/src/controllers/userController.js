const User = require("../modal/user")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
     return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})
}

const register = async (req, res) => {
    try {
        const { name, email, password, role = "user" } = req.body

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({message: 'Name, email, and password are required'})
        }

        const alreadyUser = await User.findOne({email})

        if(alreadyUser){
            return res.status(400).json({message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })

        const token = generateToken({id: user._id, role: user.role})

        // Don't return password
        const userResponse = user.toObject()
        delete userResponse.password

        res.status(201).json({
            message: 'User successfully registered',
            data: userResponse,
            token: token
        })
        
    } catch (error) {
        console.log('error at register: ', error)
        res.status(500).json({message: "Server Error"})
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body 
        
        // Validation
        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required'})
        }
        
        const user = await User.findOne({email}).select('+password')

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        const matchPassword = await bcrypt.compare(password, user.password)

        if(!matchPassword) return res.status(400).json({message: "Invalid Password"})

        const token = generateToken({id: user._id, role: user.role})

        // Don't return password
        const userResponse = user.toObject()
        delete userResponse.password

        res.status(200).json({
            message: 'Logged In',
            data: userResponse,
            token: token
        })
        
    } catch (error) {
        console.log('error at login: ', error)
        res.status(500).json({message: "Server Error"})
    }
}

module.exports = { register, login }