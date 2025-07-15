import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import publicKeyRoute from "./routes/publicKey.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth/", authRoutes);
app.use("/api", publicKeyRoute);

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
    connectDB();
});
