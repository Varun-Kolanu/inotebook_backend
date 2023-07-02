import mongoose from "mongoose";
const mongoUri = "mongodb://127.0.0.1:27017/?tls=false&directConnection=true"

const connectToMongo = async () => {
    mongoose.connect(mongoUri, {dbName: "inotebook"}).then(()=> {
        console.log("Connected to Mongo")
    }).catch(err => console.log(err))
}

export default connectToMongo

