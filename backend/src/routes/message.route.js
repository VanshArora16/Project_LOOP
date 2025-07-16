import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar } from "../controllers/message.controller.js";

const router = express.Router();

//proted routes
// for side bar
router.get("/users", protectedRoute, getUserForSidebar);
// for messages
router.get("/:id", protectedRoute, getMessages);

export default router;
