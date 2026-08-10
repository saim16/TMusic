const { songModel, ALLOWED_GENRES } = require('../models/song.model');
const mongoose = require('mongoose')
const { uploadSong, uploadSongImage } = require('../services/storage.service')
const userModel = require('../models/user.model')
async function publishSong(req, res) {
    const artist = req.user.id;

    let { songTitle, genre } = req.body;
    genre = genre.toLowerCase()
    if (!(ALLOWED_GENRES.includes(genre))) {
        return res.status(400).json({
            message: "Invalid genre",
            success: false
        });
    }

    const songFile = req.files['song'] ? req.files['song'][0] : null;
    const songImageFile = req.files['songImage'] ? req.files['songImage'][0] : null;

    if (!songFile || !songImageFile) {
        return res.status(400).json({
            message: "Both song file and song image are required.",
            success: false
        });
    }

    const song = await uploadSong(songFile.buffer.toString("base64"));
    const songImage = await uploadSongImage(songImageFile.buffer.toString("base64"));

    const songUrl = song.url, songImageUrl = songImage.url;

    const songEntry = await songModel.create({
        songUrl, songTitle, artist, songImageUrl, genre: genre || "other"
    });

    res.status(201).json({
        message: "Your song has been uploaded successfully",
        success: true
    });
}

async function getSongs(req, res) {
    try {
        const artistId = req.user.id;

        const page = req.query.page || 1;
        const limit = 10;

        const skip = (page - 1) * limit;

        const [songs, totalSongs] = await Promise.all([
            songModel.find({ artist: artistId })
                .populate('artist', 'name')
                .skip(skip)
                .sort({ createdAt: -1 })
                .limit(limit),

            songModel.countDocuments({ artist: artistId })
        ]);

        const totalPages = Math.ceil(totalSongs / limit);

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalSongs,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            songs
        })

    }
    catch (err) {
        return res.status(500).json({
            message: "Server error while fetching songs",
            success: false
        });
    }
}

async function getArtistTotalStreams(req, res) {
    try {
        const artistId = req.user.id;

        if (!artistId) {
            return res.status(400).json({
                message: "Artist ID is required.",
                success: false
            });
        }

        const result = await songModel.aggregate([
            {
                $match: {
                    artist: new mongoose.Types.ObjectId(artistId)
                }
            },
            {
                $group: {
                    _id: "$artist",
                    totalStreams: { $sum: "$streams" }
                }
            }
        ]);

        const artist = await userModel.findById(artistId);
        const followers = artist.followers;

        const streams = result.length > 0 ? result[0].totalStreams : 0;

        return res.status(200).json({
            success: true,
            artistId,
            streams,
            followers
        });

    } catch (error) {
        console.error("Error calculating artist total streams:", error);
        return res.status(500).json({
            message: "Server error while calculating streams.",
            success: false
        });
    }
}

async function getPopularSongs(req, res) {
    try {
        const artistId = req.user.id;

        // get the three most popular songs
        const songs = await songModel.find({ artist: artistId }).sort({ streams: -1 })
            .limit(3)
            .populate("artist", "name")
            .select("songTitle songImageUrl streams artist");

        return res.status(200).json({
            success: true,
            songs
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Server error while fetching songs",
            success: false
        });
    }
}

module.exports = { publishSong, getSongs, getArtistTotalStreams, getPopularSongs };