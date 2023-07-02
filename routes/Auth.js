import express from "express"
import User from "../models/Users.js"

const router = express.Router()

router.post("/", (req,res) => {
    const user = User(req.body)
    user.save()
    res.send(req.body)
})

export default router