import express from "express"
import User from "../models/Users.js"
import { body, validationResult } from "express-validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

const router = express.Router()

//* Create a new User
router.post("/create", [body("name", "Name can't be empty").notEmpty(),
body("email", "Invalid email ID").isEmail(),
body("password").isLength({ min: 5 })],
    async (req, res) => {
        try {
            let result = validationResult(req);
            const jwt_secret = process.env.JWT_SECRET
            //* If no validation error
            if (result.isEmpty()) {
                let { name, email, password } = req.body
                let user = await User.findOne({ email })
                //* If user with the email id exists already
                if (user) {
                    res.status(400).json({ error: "User already exists" })
                }
                // //* If unique user
                else {
                    const salt = await bcrypt.genSalt(10)
                    const securedPassword = await bcrypt.hash(password,salt)
                    user = await User.create({ name, email, password: securedPassword })
                    const authToken = jwt.sign(user.id, jwt_secret)
                    res.status(200).json({
                        authToken
                    })
                }
            }
            //* If validation error
            else {
                res.status(400).send({
                    errors: result.array()
                })
            }
        } catch (error) {
            //* Internal Server error
            console.log(error)
            res.status(500).json("Some error occured")
        }
    })

export default router