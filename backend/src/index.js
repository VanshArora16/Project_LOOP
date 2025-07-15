import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use("/api/auth/", authRoutes);

app.listen(PORT, () => {console.log(`server is running on ${PORT}`);});
