const mongoose = require('mongoose');

const ALLOWED_GENRES = [
    "pop", "hip-hop", "rock", "r&b", 
    "indie", "classical", "jazz", "country", "other"
];

const songSchema = new mongoose.Schema({
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    songUrl: {
        type: String,
        required: [true, "Song URL is required"]
    },
    songTitle: {
        type: String,
        required: [true, "Please enter the name of the song"],
    },
    songImageUrl: {
        type: String,
        default: null
    },
    streams: {
        type: Number,
        default: 0
    },
    genre: {
        type: String,
        enum: {
            values: ALLOWED_GENRES,
            message: "Please enter a valid genre"
        },
        default: "other",
        index: true,
        required: true
    },
    __v: { type: Number, select: false }
}, {timestamps: true});

const songModel = mongoose.model("Song", songSchema);

module.exports = {songModel, ALLOWED_GENRES};