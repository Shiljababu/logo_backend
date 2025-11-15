import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

const connectionstring = process.env.DBCONNECTIONSTRING

const connectDb = async () => {
    try {
        await mongoose.connect(connectionstring)
        console.log("MongoDB connected successfully")
    } catch (err) {
        console.log("MongoDB connection failed!!", err.message)
    }
}

export default connectDb
