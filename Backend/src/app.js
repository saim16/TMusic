const express = require('express');
const cors = require('cors');
const app = express();

// Routers
const authRouter = require('./routes/auth.route');
const artistRouter = require('./routes/artist.route');
const browseRouter = require('./routes/browse.route');
const streamRouter = require('./routes/stream.route');
const userRouter = require('./routes/user.route');

const cookieParser = require('cookie-parser');

// mounting middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// mounting routers
app.use("/auth", authRouter);
app.use("/artist", artistRouter);
app.use("/api/browse", browseRouter);
app.use("/stream", streamRouter);
app.use("/user", userRouter);

module.exports = app;