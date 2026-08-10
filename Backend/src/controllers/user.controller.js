const streamModel = require('../models/stream.model');
const userModel = require('../models/user.model');

async function getMostStreamedSongs(req, res) {
    try {

        const userId = req.user.id;

        const songs = await streamModel.find({ listener: userId })
            .sort({ streams: -1 })
            .limit(50)
            .populate({
                path: "song",
                select: "songTitle songUrl songImageUrl artist",
                populate: {
                    path: "artist",
                    select: "name"
                }
            });

        return res.status(200).json({
            success: true,
            songs
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Server error while fetching most played songs.",
            success: false
        });
    }

}

async function getUser(req, res) {
    try {
        const userId = req.user.id;

        const user = await userModel.findById(userId).select("+savedSongs +following").populate({
            path: "savedSongs",
            select: "songTitle songUrl songImageUrl streams genre artist createdAt",
            populate: {
                path: "artist",
                select: "name"
            }
        })
            .populate({
                path: "following"
            });

        return res.status(200).json({
            success: true,
            user
        })
    }
    catch (err) {
        return res.status(500).json({
            message: 'Server error while fetching user.',
            success: false
        });
    }

}

async function changeName(req, res) {
    try {
        const userId = req.user.id;

        const updatedName = req.body.name;

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { name: updatedName } },
            { returnDocument: 'after', runValidators: true }
        ).select("name");

        return res.status(200).json({
            success: true,
            message: "Name updated successfully.",
            updatedUser
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Server error while updating password.",
            success: false
        });
    }
}


async function changePassword(req, res) {
    try {
        const userId = req.user.id;

        const { oldPassword, newPassword } = req.body;
        let user = await userModel.findById(userId).select("+password");

        const validPassword = await user.comparePassword(oldPassword);

        if (!validPassword) {
            return res.status(401).json({
                message: "Wrong password.",
                success: false
            });
        }
        user.password = newPassword;
        await user.save();

        user.select("-password")
        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
            user
        })
    }
    catch (err) {
        console.error("error occured while updating password ", err)
        return res.status(500).json({
            message: 'Server error while changing password.',
            success: false
        });
    }
}

async function changeEmail(req, res) {
    try {
        const userId = req.user.id;

        const { password, email } = req.body;

        const emailAlreadyExists = await userModel.findOne({
            email: email
        });

        if (emailAlreadyExists) {
            return res.status(401).json({
                message: "Cannot use this email as it is already in use.",
                success: false
            });
        }

        const user = await userModel.findById(userId).select("+password");

        const validPassword = await user.comparePassword(password);

        if (!validPassword) {
            return res.status(401).json({
                message: "Wrong password.",
                success: false
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { email: email } },
            { returnDocument: 'after', runValidators: true }
        ).select("email");



        return res.status(200).json({
            success: true,
            message: "Email updated successfully.",

        })
    }
    catch (err) {
        console.error("error occured while updating email ", err)
        return res.status(500).json({
            message: 'Server error while changing email.',
            success: false
        });
    }
}

async function changeUserImage(req, res) {
    try {
        const userId = req.user.id;

        const userimage = req.file;

        if (!userimage) {
            return res.status(400).json({
                message: "Please upload an image.",
                success: false
            });
        }

        const userimageurl = await uploadUserImage(userimage.buffer.toString("base64"));

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $set: { userimage: userimageurl.url } },
            { returnDocument: 'after', runValidators: true }
        ).select("userimage");

        return res.status(200).json({
            success: true,
            message: "Image updated successfully.",
            updatedUser
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Server error while updating image.",
            success: false
        });
    }
}

module.exports = { getMostStreamedSongs, changeName, changePassword, changeEmail, getUser, changeUserImage };