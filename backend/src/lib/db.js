import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const CONNECTION = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MONGODB connected: ${CONNECTION.connection.host}`);
    } catch (error) {
        console.log(`MONGODB connection ERROR: ${error}`);
    }
};
