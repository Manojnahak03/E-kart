import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/ekart`);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
        throw error;
    }

}

export default connectDB;