const userModel = require('../models/user.model');
const otpModel = require('../models/otp.model');
const { uploadUserImage } = require('../services/storage.service');
const emailService = require('../services/email.service');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

async function checkIfUserExists(email, username, res) {
    const emailAlreadyExists = await userModel.findOne({
        email: email
    });
    const usernameAlreadyExists = await userModel.findOne({
        username: username
    });

    if (usernameAlreadyExists && emailAlreadyExists) {
        res.status(409).json({
            message: "The email and username are already in use.",
            success: false
        })
        return true;
    }
    if (usernameAlreadyExists && !emailAlreadyExists) {
        res.status(409).json({
            message: "This username is already in use.",
            success: false
        })
        return true;
    }
    if (!usernameAlreadyExists && emailAlreadyExists) {
        res.status(409).json({
            message: "This email is already in use.",
            success: false
        })
        return true;
    }

    return false;
}

async function verifyOTP(email, otp, res) {
    // check if otp exists
    if (!otp) {
        res.status(400).json({
            message: "OTP is required to complete registration.",
            success: false
        });
        return false;
    }

    // check if otp entry exists (or has expired)
    const getOtpEntry = await otpModel.findOne({ email });

    if (!getOtpEntry) {
        // this means either there is no entry at all, or otp has expired
        res.status(400).json({
            message: "OTP has expired or was never requested.",
            success: false
        });
        return false;
    }
    // check if otp is correct
    const validOTP = await bcrypt.compare(otp, getOtpEntry.otp);
    if (!validOTP) {
        res.status(400).json({
            message: "Invalid OTP. Please try again.",
            success: false
        });
        return false;
    }

    // delete otp
    await otpModel.deleteOne({ _id: getOtpEntry._id });

    // otp verification complete

    return true;
}

async function sendOTP(req, res) {
    const { email, username } = req.body;

    if (await checkIfUserExists(email, username, res)) {
        return;
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const hashedOTP = await bcrypt.hash(otp, 10);

    await otpModel.deleteMany({ email });

    const otpEntry = await otpModel.create({
        email,
        otp: hashedOTP
    })

    try {
        await emailService.sendEmailOTP(email, username, otp);
    }
    catch (err) {
        console.log('Error occurred: ', err);
        return res.status(400).json({
            message: "Error encountered while sending email",
            success: false
        })
    }

    return res.status(200).json({
        message: "OTP sent successfully to your email.",
        email: email,
        success: true
    });
}


async function registerUser(req, res) {
    const { name, username, email, password, role = "Listener", otp } = req.body;

    // checking if the username and email are available or not
    if (await checkIfUserExists(email, username, res)) {
        return;
    }

    // check if otp is valid
    if (!(await verifyOTP(email, otp, res))) {
        return;
    }

    const userimage = req.file;
    let user;
    if (userimage) {
        const userimageurl = await uploadUserImage(userimage.buffer.toString("base64"));

        user = await userModel.create({
            name, username, email, password, role,
            userimage: userimageurl.url
        });
    }
    else {
        user = await userModel.create({
            name, username, email, password, role
        });
    }

    const token = jwt.sign({
        id: getUser._id,
        role: getUser.role
    }, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        message: "Account created successfully.",
        success: true,
        user
    })

    await emailService.sendRegistrationEmail(email, name);
}


async function loginUser(req, res) {
    const { email, username, password } = req.body;

    const getUser = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    }).select("+password");

    if (!getUser) {
        return res.status(400).json({
            message: "Please enter an existing email or username",
            success: false
        });
    }

    // compare password

    const validPassword = await getUser.comparePassword(password);

    if (!validPassword) {
        return res.status(401).json({
            message: "Wrong password.",
            success: false
        });
    }

    const token = jwt.sign({
        id: getUser._id,
        role: getUser.role
    }, process.env.JWT_SECRET, { expiresIn: '3d' });

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Login successful.",
        success: true
    })
}


module.exports = { registerUser, loginUser, sendOTP };