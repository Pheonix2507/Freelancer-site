import mongoose from "mongoose";

export async function connectDB() {
    try {
        mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB connected successfully!");
        });

        connection.on("error", (err) => {
            console.error("MongoDB connection error! Please make sure MongoDB is running!", err);
            process.exit(1);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};