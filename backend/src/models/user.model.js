import mongoose from "mongoose";
// user blueprint
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },
        fullName: {
            type: String,
            required: [true, "fullName is required"],
            trim: true,
            minlength: [3, "Full name must be at least 3 characters"],
            match: [
                /^[\p{L}\s]+$/u,
                "Full name must contain only letters and spaces",
            ],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [16, "Password must be at least 16 characters"],
        },
        profilePic: {
            type: String,
            default: "",
        },
        cloudinaryId: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);
// user mold
const User = mongoose.model("User", userSchema);

export default User;
