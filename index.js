import connectToMongo from "./db.js";
import express from "express";
import AuthRouter from "./routes/Auth.js";
import NotesRouter from "./routes/Notes.js";

const app = express();
const port = 8000

connectToMongo()
//Middlewares
app.use(express.json())

//Default
app.get('/', (req, res) => {
    res.send("Home Page")
})

//Available routes
app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/notes", NotesRouter)

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})