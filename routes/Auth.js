import express from "express"
import User from "../models/Users.js"
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import fetchUser from "../middlewares/fetchUser.js"
import { config } from "dotenv"
config()

const router = express.Router()
const jwt_secret = process.env.JWT_SECRET

//* ROUTE 1: Create a new User using /api/v1/auth/create endpoint
router.post("/create", [body("name", "Name can't be empty").notEmpty(),
body("email", "Invalid email ID").isEmail(),
body("password").isLength({ min: 5 })],
    async (req, res) => {
        try {
            let errors = validationResult(req);
            //* If no validation error
            if (errors.isEmpty()) {
                let { name, email, password } = req.body
                let user = await User.findOne({ email })
                //* If user with the email id exists already
                if (user) {
                    res.status(400).json({ error: "User already exists" })
                }
                // //* If unique user
                else {
                    const salt = await bcrypt.genSalt(10)
                    const securedPassword = await bcrypt.hash(password, salt)
                    user = await User.create({ name, email, password: securedPassword })
                    const data = {
                        user: {
                            id: user.id,
                        }
                    }
                    const authToken = jwt.sign(data, jwt_secret)
                    res.status(200).json({
                        authToken
                    })
                }
            }
            //* If validation error
            else {
                res.status(400).send({
                    errors: errors.array()
                })
            }
        } catch (error) {
            //* Internal Server error
            console.log(error)
            res.status(500).json("Some error occured")
        }
    })


//* ROUTE 2: Login with /api/v1/auth/login endpoint
router.post('/login', [
    body("email").isEmail(),
    body("password").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send({ errors: errors.array() })
    try {
        const { email, password } = req.body
        let user = await User.findOne({ email })
        if (!user) return res.status(400).json({ error: "Please login with correct credentials" })

        const passwordIsCorrect = await bcrypt.compare(password, user.password)
        if (!passwordIsCorrect) return res.status(400).json({ error: "Please login with correct credentials" })

        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, jwt_secret)
        res.status(200).json({
            authToken
        })
    } catch (error) {
        //* Internal Server error
        console.log(error)
        res.status(500).json("Some error occured")
    }
})

//* ROUTE 3: Get user by /api/v1/auth/getuser
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId).select("-password")
        res.status(200).json(user)
    } catch (error) {
        //* Internal Server error
        console.log(error)
        res.status(500).json("Some error occured")
    }
})

export default router