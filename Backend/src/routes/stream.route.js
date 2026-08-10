
const express = require('express');
const router = express.Router();

// controller
const streamController = require('../controllers/stream.controller');

// middleware
const authMiddleware = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');

const rateLimiting = rateLimit({
    windowMs: 1000 * 60,
    limit: 15,
    message: {
        success: false,
        message: "Too many requests"
    },
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false
})


/**
 * @route   GET /stream/play/:songId
 * @desc    Play a song
 * @access  All Users
 */
router.get("/play/:songId", rateLimiting, authMiddleware.checkIfValidToken, streamController.playSong);

/**
 * @route   POST /stream/save/:songId
 * @desc    save a song
 * @access  All Users
 */
router.post("/save/:songId", authMiddleware.checkIfValidToken, streamController.saveSong);

/**
 * @route   GET /stream/savedSongs
 * @desc    Display Saved Songs
 * @access  All Users
 */
router.get("/savedSongs", authMiddleware.checkIfValidToken, streamController.getSavedSongs);

/**
 * @route   GET /stream/recents
 * @desc    Display Recently Played Songs
 * @access  All Users
 */
router.get("/recents", authMiddleware.checkIfValidToken, streamController.recentlyPlayed);



module.exports = router;
