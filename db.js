import mongoose from "mongoose";
const mongoUri = "mongodb://127.0.0.1:27017/?tls=false&directConnection=true"

const connectToMongo = async () => {
    await mongoose.connect(mongoUri)
    console.log("Connected to Mongo")
}

export default connectToMongo

