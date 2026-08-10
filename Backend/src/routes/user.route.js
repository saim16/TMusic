
const express = require('express');
const router = express.Router();

// controller
const userController = require('../controllers/user.controller');

// middleware
const authMiddleware = require('../middleware/auth.middleware');


/**
 * @route   GET /user/analytics/
 * @desc    Get top 50 most streamed songs
 * @access  All Users
 */
router.get("/analytics", authMiddleware.checkIfValidToken, userController.getMostStreamedSongs);


/**
 * @route   GET /user/
 * @desc    get user's details
 * @access  All Users
 */
router.get("/get-user", authMiddleware.checkIfValidToken, userController.getUser);

/**
 * @route   GET /user/edit-password/
 * @desc    Change the password of the user
 * @access  All Users
 */
router.patch("/edit-password", authMiddleware.checkIfValidToken, userController.changePassword);

/**
 * @route   GET /user/edit-email/
 * @desc    Change the email of the user
 * @access  All Users
 */
router.patch("/edit-email", authMiddleware.checkIfValidToken, userController.changeEmail);

/**
 * @route   GET /user/edit-image/
 * @desc    Change the userimage of the user
 * @access  All Users
 */
router.patch("/edit-image", authMiddleware.checkIfValidToken, userController.changeUserImage);





module.exports = router;
