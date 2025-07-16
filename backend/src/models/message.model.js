import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
const Message = new mongoose.model("Message", messageSchema);

export default Message;

// in future
// status: {
//             type: String,
//             enum: ["send", "delivered", "read"],
//             default: "sent",
//         },
//         mediaType: {
//             type: String,
//             enum: ["image", "video", "file"],
//         },
