import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {

        // if fullName || email || password not provided
        if (!fullName||!password||!email){
            return res.status(400).json({
                message: "All fields are required!",
            });
        }



        // check password length
        if (password.length < 16) {
            return res.status(400).json({
                message: "password length must be at least 16 characters",
            });
        }

        // check user exist or not
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        // hash passwords
        const salt = await bcrypt.genSalt(11);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // generating jwt token
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic || null,
            });
        } else {
            return res.status(400).json({
                message: "Invalid user data",
            });
        }
    } catch (error) {
        console.log(`Error in signup controller ${error}`);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const login = (req, res) => {
    res.send("<h1>login route</h1>");
};

export const logout = (req, res) => {
    res.send("<h1>logout route</h1>");
};
