import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.Jwt_token;
        //checking token exist or not
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No Token Provided" });
        }
        // reading key
        const publicKeyPath = path.join(
            process.cwd(),
            process.env.PUBLIC_KEY_PATH
        );
        const publicKey = fs.readFileSync(publicKeyPath, "utf8");

        //checking token is valid or not
        const decoded = jwt.verify(token, publicKey, {
            algorithms: "RS256",
        });
        if (!decoded) {
            return res
                .status(401)
                .json({ message: "Unauthorized - Invalid Token" });
        }
        // finding user by id
        const user = await User.findById(decoded.userId).select("-password");

        // checking user or not found
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in ProtectedRoute middleware:", error.message);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};
