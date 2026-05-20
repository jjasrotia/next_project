import mongoose from "mongoose";
//check if connection exists
type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    //check if connection exists

    if (connection.isConnected) {
        console.log("Already Connected")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        connection.isConnected = db.connections[0].readyState   
        console.log("db connected successfully")

    } catch (error) {
        console.log("db connection failed", error)
        process.exit(1)
    }
} 


export default dbConnect;