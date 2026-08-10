const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully.");
    }
    catch (err) {
        console.error('Error occured: ', err);
    }
}

module.exports = connectDB;