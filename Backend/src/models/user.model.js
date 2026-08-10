const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },  
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "This username is already taken"],
        trim: true,
        index: true,
    },
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
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should contain more than 5 characters"],
        select: false, // whenever userdata is fetched, password wont be sent
        trim: true,
    },
    role: {
        type: String,
        enum: {
            values: ["Listener", "Artist"],
            message: "Invalid account type",
        },
        default: "Listener",
        required: [true, "Please enter the type of profile you want to create"],
    },
    userimage: {
        type: String,
        default: "https://ik.imagekit.io/tda3yj5sh/tmusic/userimages/image_1785654887568_tsDN9hX_6?updatedAt=1785654893575"
    },
    followers: {
        type: Number,
        default: 0
    },
    savedSongs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Song",
        select: false
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        select: false
    },
    __v: { type: Number, select: false }
});

userSchema.pre("save", async function() {
    if(!this.isModified("password")){ 
        return ;
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);

    this.password = hashedPassword;
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;