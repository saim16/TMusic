const jwt = require('jsonwebtoken');

async function tokenExists(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    

    if(!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(400).json({
            message: "You are already logged in",
            success: false
        });
    }
    catch(err) {
        return next();
    }
}

module.exports = {tokenExists}