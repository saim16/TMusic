/**
  handles:
  * - getting songs from a particular genre
  * - getting list of artists sorted by most followers
  * - getting profile of artist
  * - getting all songs of an artist
  * - following an artist
 */

const express = require('express');
const router = express.Router();

// controller
const browseController = require('../controllers/browse.controller');

// middleware
const authMiddleware = require('../middleware/auth.middleware');


/**
 * @route   GET api/browse/genres/:genre
 * @desc    Get songs from a particular genre
 * @access  All Users
 */
router.get("/genres/:genre", authMiddleware.checkIfValidToken, browseController.getSongsByGenre);

/**
 * @route   GET api/browse/top-artists
 * @desc    Get top 10 artists
 * @access  All Users
 */
router.get("/top-artists", authMiddleware.checkIfValidToken, browseController.getTopArtists);

/**
 * @route   GET api/browse/all-artists
 * @desc    Get all artists
 * @access  All Users
 */
router.get("/all-artists", authMiddleware.checkIfValidToken, browseController.getAllArtists);

/**
 * @route   GET api/browse/profile/:artistId
 * @desc    Go to artist's profile
 * @access  All Users
 */
router.get("/profile/:artistId", authMiddleware.checkIfValidToken, browseController.artistPage);

/**
 * @route   GET api/browse/profile/:artistId/songs
 * @desc    Get all of the songs of an artist
 * @access  All Users
 */
router.get("/profile/:artistId/songs", authMiddleware.checkIfValidToken, browseController.getArtistSongs);

/**
 * @route   POST api/browse/profile/:artistId/follow
 * @desc    Follow an artist
 * @access  All Users 
 */
router.patch("/profile/:artistId/follow", authMiddleware.checkIfValidToken, browseController.followArtist);






module.exports = router;