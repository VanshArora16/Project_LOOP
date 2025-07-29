import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import publicKeyRoute from "./routes/publicKey.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.io.js";

import path from "path";

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(cookieParser()); //middleware & read and parse cookies from incoming request
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// update payload limit and parsing data into json
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/auth/", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", publicKeyRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.all(/.*/, (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    }
    
);
}
server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    connectDB();
});
