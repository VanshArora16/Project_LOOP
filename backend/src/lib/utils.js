import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // reading private keys
    let privateKey, privateKeyPath;
    try {
        privateKeyPath = path.join(process.cwd(),process.env.PRIVATE_KEY_PATH)
        privateKey = fs.readFileSync(privateKeyPath, "utf8");
    } catch (error) {
        console.error("Failed to read private key:", error.message);
        return res.status(500).json({ message: "Token generation failed" });
    }

    // generating token
    const token = jwt.sign({ userId }, privateKey, {
        algorithm: "RS256",
        expiresIn: "7d",
    });

    // sending token to cookie
    res.cookie("Jwt_token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // In ms
        httpOnly: true, // prevent XSS attack cross-site scripting attack
        sameSite: "strict", //CSRF attack cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
    });

    // returning token back to user
    return token;
};
