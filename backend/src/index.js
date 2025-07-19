import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import publicKeyRoute from "./routes/publicKey.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser()); //middleware & read and parse cookies from incoming request
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// update payload limit and parsing data into json
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/auth/", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", publicKeyRoute);

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    connectDB();
});
