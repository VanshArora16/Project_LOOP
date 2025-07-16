import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(`Error in getUsersForSideBar: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: UserToChatId } = req.params.id;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: UserToChatId },
                { senderId: UserToChatId, receiverId: myId },
            ],
        });
        res.status(200).json({ messages });
    } catch (error) {
        console.log(`Error in getMessages controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const sendMessages = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res
                .status(400)
                .json({ error: "Message must contain text or image" });
        }
        let imageURL;
        // user passing image or not
        if (image) {
            //upload base 64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageURL,
        });

        await newMessage.save();

        // todo: realtime functionality goes here =>socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(`Error in sendMessages controller: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};
