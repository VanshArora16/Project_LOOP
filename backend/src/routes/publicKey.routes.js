import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/public-key", (req, res) => {
    try {
        // key path
        const publicKeyPath = path.join(process.cwd(), process.env.PUBLIC_KEY_PATH);
        
        const publicKey = fs.readFileSync(publicKeyPath, "utf8");
        
        res.setHeader("Content-Type", "text/plain");
        res.send(publicKey);
    } catch (error) {
        console.log(`Failed to serve public key: ${error.message}`);
        res.status(500).json({ message: "Unable to serve Public Key" });
    }
});

export default router;