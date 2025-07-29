import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const CONNECTION = await mongoose.connect(process.env.MONGODB_URL);
    } catch (error) {
        console.log(`MONGODB connection ERROR: ${error}`);
    }
};
