import mongoose , { Schema } from "mongoose";

const NotesSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: 'General'
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

const Note = mongoose.model('Note', NotesSchema);

export default Note;