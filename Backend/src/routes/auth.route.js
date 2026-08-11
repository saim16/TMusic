const express = require('express');
const authController = require('../controllers/auth.controller');
const preAuthMiddlware = require('../middleware/preauth.middleware');
const multer = require('multer');
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

/**
 * @route   POST /api/auth/send-otp
 * @desc    Check user uniqueness and send registration OTP
 * @access  Public (Blocked if already logged in)
 */
router.post('/send-otp', preAuthMiddlware.tokenExists, authController.sendOTP);

/**
 * @route   POST /api/auth/register
 * @desc    Verify OTP and create user account
 * @access  Public (Blocked if already logged in)
 */
router.post('/register', preAuthMiddlware.tokenExists, upload.single('userimage'), authController.registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & set token cookie
 * @access  Public (Blocked if already logged in)
 */
router.post('/login', preAuthMiddlware.tokenExists, authController.loginUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout
 * @access  Public (Blocked if already logged in)
 */
router.post('/logout', authController.logoutUser);


module.exports = router;