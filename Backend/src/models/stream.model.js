const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
    listener: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
        index: true,
        required: true
    },
    streams: {
        type: Number,
        default: 0
    },
    listenedAt: {
        type: Date,
        default: Date.now,
        index: true 
    }
}, {timestamps: true});

const streamModel = mongoose.model("Stream", streamSchema);

module.exports = streamModel;