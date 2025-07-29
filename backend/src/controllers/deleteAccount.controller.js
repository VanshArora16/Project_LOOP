import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js'
export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.cloudinaryId) {
            await cloudinary.uploader.destroy(user.cloudinaryId);
        }
        await User.findByIdAndDelete(req.user._id);

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error("Delete account error:", error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
};
