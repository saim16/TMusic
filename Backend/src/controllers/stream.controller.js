const { songModel } = require('../models/song.model');
const streamModel = require('../models/stream.model');
const userModel = require('../models/user.model')

async function playSong(req, res) {
    try {
        const { songId } = req.params;
        const userId = req.user.id;

        const song = await songModel.findByIdAndUpdate(
            songId,
            {
                $inc: { streams: 1 }
            }
        ).populate({
            path: "artist",
            select: "name"
        });

        if (!song) {
            return res.status(400).json({
                message: "This song doesn't exist",
                success: false
            })
        }

        let stream = await streamModel.findOneAndUpdate({
            listener: userId,
            song: songId
        }, {
            $inc: { streams: 1 },
            returnDocument: 'after'
        });

        if (!stream) {
            stream = await streamModel.create({
                listener: userId,
                song: songId,
                streams: 1
            });
        }

        return res.status(200).json({
            message: "Listened",
            success: true,
            song
        })
    }
    catch (err) {
        console.error("Error playing song:", err);
        return res.status(500).json({
            message: "Server error while playing songs.",
            success: false
        });
    }
}

async function saveSong(req, res) {
    try {
        const { songId } = req.params;
        const userId = req.user.id;

        const songExists = await songModel.findById(songId);

        if (!songExists) {
            return res.status(400).json({
                message: "This song doesn't exist",
                success: false
            })
        }

        const isSaved = await userModel.exists({
            _id: userId,
            savedSongs: songId
        });

        if (!isSaved) {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $addToSet: { savedSongs: songId } },
                { returnDocument: 'after' }
            );

            return res.status(200).json({
                message: "Song Saved.",
                success: true,
            })
        }
        else {
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { $pull: { savedSongs: songId } },
                { returnDocument: 'after' }
            );

            return res.status(200).json({
                message: "Unsaved Song.",
                success: true,
            })
        }
    }
    catch (err) {
        console.error("Error saving song:", err);
        return res.status(500).json({
            message: "Server error while saving the song.",
            success: false
        });
    }
}

async function getSavedSongs(req, res) {
    try {

        const userId = req.user.id;

        const user = await userModel.findById(userId)
            .select("savedSongs")
            .populate({
                path: "savedSongs",
                select: "songTitle songUrl songImageUrl streams genre artist createdAt",
                populate: {
                    path: "artist",
                    select: "name"
                }
            });

        return res.status(200).json({
            message: "Fetched saved songs successfully.",
            success: true,
            totalSaved: user.savedSongs.length,
            songs: user.savedSongs
        });
    }
    catch (err) {
        console.error("Error fetching saved songs:", err);
        return res.status(500).json({
            message: "Server error while fetching saved songs.",
            success: false
        });
    }
}

async function recentlyPlayed(req, res) {
    try {
        const streams = await streamModel.find({ listener: req.user.id })
            .sort({ updatedAt: -1 })
            .populate({
                path: "song",
                select: "songTitle songUrl songImageUrl artist",
                populate: {
                    path: "artist",
                    select: "name"
                }
            })
            .limit(10);

        const songs = streams
            .map(stream => stream.song)
            .filter(song => song !== null);

        return res.status(200).json({
            success: true,
            songs
        });
    } catch (err) {
        console.error("Error fetching recents:", err);
        return res.status(500).json({
            message: "Server error while fetching recently played songs.",
            success: false
        });
    }
}

module.exports = { playSong, saveSong, getSavedSongs, recentlyPlayed };