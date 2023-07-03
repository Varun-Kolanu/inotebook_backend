import express from "express"
import fetchUser from "../middlewares/fetchUser.js"
import Note from "../models/Notes.js"
import { body, validationResult } from "express-validator"

const router = express.Router()

//* ROUTE 1: Create a Note by /api/v1/notes/create
router.post('/create', fetchUser, [
    body("title", "Title should be atleast 3 characters").isLength({min:3}),
    body("description", "Description should be atleast 3 characters").isLength({min:3})
], async (req, res) => {
    try {
        const validationErrors = validationResult(req)
        if(!validationErrors.isEmpty()) return res.status(400).send({ errors: errors.array() })
        const userId = req.userId
        const {title, description, tag} = req.body
        const note = await Note.create({
            userId,
            title,
            description,
            tag
        })
        res.status(200).json(note)
    } catch (error) {
        //* Internal Server error
        console.log(error)
        res.status(500).json("Some error occured")
    }
})

//* ROUTE 2: Get Notes by /api/v1/notes/getnotes
router.get("/getnotes", fetchUser, async (req,res) => {
    try {
        const userId = req.userId
        const notes = await Note.find({userId})
        res.status(200).json(notes)
    } catch (error) {
         //* Internal Server error
        console.log(error)
        res.status(500).json("Some error occured")
    }
})

export default router