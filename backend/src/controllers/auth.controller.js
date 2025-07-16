import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // if fullName || email || password not provided
        if (!fullName || !password || !email) {
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

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // email or password are given or not
        if (!email || !password) {
            return res.status(400).json({
                message: "All Fields Are Required",
            });
        }
        const user = await User.findOne({ email });

        // check user exist or not
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // check password is correct or not
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log(`Error in Login controller ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt_token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(`Error in Logout controller ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res
                .status(404)
                .json({ message: "profile Image is required" });
        }

        if (!profilePic.startsWith("data:image")) {
            return res.status(400).json({ message: "Invalid image format" });
        }
        const user = await User.findById(userId);

        //DELETE OLD IMAGE
        if (user.cloudinaryId) {
            await cloudinary.uploader.destroy(user.cloudinaryId);
        }
        //UPLOAD NEW IMAGE
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            width: 300,
            crop: "scale",
            folder: "avatars",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "webp"],
        });

        const { secure_url, public_id } = uploadResponse;

        if (!secure_url) {
            return res
                .status(500)
                .json({ message: "Cloudinary upload failed" });
        }
        // UPDATE USER PROFILE WITH NEW IMAGE AND CLOUDINARY ID
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: secure_url, cloudinaryId: public_id },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(`Error in Update Profile: ${error}`);
        next(error);
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user) ;
    } catch (error) {
        console.log(`Error in checkAuth controller ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
