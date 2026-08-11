const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

async function checkIfUserIsAnArtist(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token not found.",
            success: false
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "Artist") {
            return res.status(401).json({
                message: "Unauthorised Access.",
                success: false
            });
        }

        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid Token",
            success: false
        });
    }
}

async function checkIfValidToken(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token not found.",
            success: false
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid Token",
            success: false
        });
    }
}


module.exports = { checkIfUserIsAnArtist, checkIfValidToken };