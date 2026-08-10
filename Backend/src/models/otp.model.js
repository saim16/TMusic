const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "This email is already in use"],
        trim: true,
        index: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
            "Please enter a valid email address"
        ],
    },
    otp: {
        type: String,
        requied: [true, "Please provide an otp"]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 600
    }
});

const otpModel = mongoose.model("OTPEntry", otpSchema);

module.exports = otpModel;