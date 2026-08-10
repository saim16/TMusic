const {ImageKit} = require("@imagekit/nodejs");

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PVTKEY
})


const uploadUserImage = async (file) => {
    const result = await client.files.upload({
        file,
        fileName: "image_" + Date.now(),
        folder: "tmusic/userimages"
    });

    return result;
}

const uploadSongImage = async (file) => {
    const result = await client.files.upload({
        file,
        fileName: "songimage_" + Date.now(),
        folder: "tmusic/songimages"
    });

    return result;
}

const uploadSong = async (file) => {
    const result = await client.files.upload({
        file,
        fileName: "song_" + Date.now(),
        folder: "tmusic/songs"
    })

    return result;
}

module.exports = {uploadUserImage, uploadSongImage, uploadSong};