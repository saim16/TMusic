const express = require('express');
const router = express.Router();

// middlewares
const multer = require('multer');
const authMiddleware = require('../middleware/auth.middleware');

const upload = multer({
    storage: multer.memoryStorage()
});

const uploadSongAndSongImage = upload.fields([
    { name: "song", maxCount: 1 },
    { name: "songImage", maxCount: 1 }
]);

// controller
const artistController = require('../controllers/artist.controller');

/**
 * @route   POST /artist/publish-song
 * @desc    Upload and publish a song
 * @access  Artist
 */
router.post('/publish-song', authMiddleware.checkIfUserIsAnArtist, uploadSongAndSongImage, artistController.publishSong);

/**
 * @route   GET /artist/get-songs
 * @desc    Fetch all songs of an artist
 * @access  Artist
 */
router.get('/get-songs', authMiddleware.checkIfUserIsAnArtist, artistController.getSongs);

/**
 * @route   GET /artist/total-streams
 * @desc    Fetch the total streams of an artist
 * @access  Artist
 */
router.get('/total-streams', authMiddleware.checkIfUserIsAnArtist, artistController.getArtistTotalStreams);

/**
 * @route   GET /artist/popular-songs
 * @desc    Fetch the three most popular songs of the artist
 * @access  Artist
 */
router.get('/popular-songs', authMiddleware.checkIfUserIsAnArtist, artistController.getPopularSongs);

module.exports = router;