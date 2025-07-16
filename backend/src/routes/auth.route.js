import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
    checkAuth,
    login,
    logout,
    signup,
    updateProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

//public auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// protected routes
router.put("/update-profile", protectedRoute, updateProfile);
router.get("/check", protectedRoute, checkAuth);

export default router;
