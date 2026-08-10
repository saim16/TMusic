const { songModel, ALLOWED_GENRES } = require('../models/song.model');
const userModel = require('../models/user.model');

// get songs of a particular genre
/**
 * Route: GET /browse/:genreName?page=1
 */
async function getSongsByGenre(req, res) {
    try {
        let { genre } = req.params;
        genre = genre.toLowerCase();

        if (!(ALLOWED_GENRES.includes(genre))) {
            return res.status(400).json({
                message: "Invalid genre",
                success: false
            });
        }

        const page = req.query.page || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const [songs, totalSongs] = await Promise.all([
            songModel.find({ genre })
                .populate('artist', 'name')
                .sort({ streams: -1 })
                .skip(skip)
                .limit(limit),

            songModel.countDocuments({ genre })
        ]);

        const totalPages = Math.ceil(totalSongs / limit);

        return res.status(200).json({
            success: true,
            genre,
            page,
            totalSongs,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            songs
        });

    } catch (error) {
        console.error("Error fetching songs by genre:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
}

async function getTopArtists(req, res) {
    const artists = await userModel.find({ role: "Artist" })
        .sort({ followers: -1 })
        .select("-email -username -role -savedSongs")
        .limit(10);

    return res.status(200).json({
        success: true,
        artists
    })
}

async function getAllArtists(req, res) {

    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * 10;

    const [artists, totalArtists] = await Promise.all([
        userModel.find({ role: "Artist" })
            .sort({ followers: -1 })
            .select("-email -username -role -savedSongs")
            .limit(limit)
            .skip(skip),

        userModel.countDocuments({ role: "Artist" })
    ]);

    const totalPages = Math.ceil(totalArtists / limit);


    return res.status(200).json({
        success: true,
        page,
        totalArtists,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        artists
    })
}

async function artistPage(req, res) {
    const { artistId } = req.params;

    const artist = await userModel.findById(artistId).select("-email -role");


    // now we get the songs uploaded by the artist
    const songs = await songModel.find({ artist: artistId }).sort({ streams: -1 }).limit(10);

    res.status(200).json({
        success: true,
        artist,
        songs
    })
}


async function getArtistSongs(req, res) {
    try {
        const { artistId } = req.params;

        const artist = await userModel.findById(artistId);
        const artistName = await artist.name;

        const page = req.query.page || 1;
        const limit = 10;

        const skip = (page - 1) * limit;

        const [songs, totalSongs] = await Promise.all([
            songModel.find({ artist: artistId })
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
            songs,
            artistName
        })

    }
    catch (err) {
        return res.status(500).json({
            message: "Server error while fetching songs",
            success: false
        });
    }
}

async function followArtist(req, res) {
    const { artistId } = req.params;
    const userId = req.user.id;
    if (userId === artistId) {
        return res.status(400).json({
            message: "You cannot follow yourself",
            success: false
        });
    }

    const isFollowing = await userModel.exists({
        _id: userId,
        following: artistId
    });

    if (!isFollowing) {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $addToSet: { following: artistId } },
            { returnDocument: 'after' }
        );

        const artist = await userModel.findByIdAndUpdate(
            artistId,
            { $inc: { followers: 1 } },
        );
        return res.status(200).json({
            message: "Followed.",
            success: true,
            updatedUser
        })
    }
    else {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $pull: { following: artistId } },
            { returnDocument: 'after' }
        );

        const artist = await userModel.findByIdAndUpdate(
            artistId,
            { $inc: { followers: -1 } },
        );
        return res.status(200).json({
            message: "Unfollowed.",
            success: true
        })
    }
}

module.exports = { getSongsByGenre, getTopArtists, getAllArtists, artistPage, getArtistSongs, followArtist };