import connectToMongo from "./db.js";
import express from "express";

const app = express();
const port = 8000

connectToMongo()

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})