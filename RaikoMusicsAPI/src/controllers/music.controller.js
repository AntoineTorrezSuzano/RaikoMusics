// src/controllers/music.controller.js
const fs = require('fs');

const uploadMusic = (req, res) => {
    const { title, artist } = req.body;

    // Check for required text fields
    if (!title || !artist) {
        // If validation fails after upload, clean up the created folder
        if (req.albumPath) {
            fs.rm(req.albumPath, { recursive: true, force: true }, () => { });
        }
        return res.status(400).json({ success: false, message: 'Title and artist are required.' });
    }

    // Check if files were actually uploaded
    if (!req.files || !req.files.song || !req.files.cover) {
        if (req.albumPath) {
            fs.rm(req.albumPath, { recursive: true, force: true }, () => { });
        }
        return res.status(400).json({ success: false, message: 'Both a song and a cover image are required.' });
    }

    const songPath = req.files.song[0].path;
    const coverPath = req.files.cover[0].path;

    console.log(`Received new offering: "${title}" by ${artist}`);
    console.log(`Song saved to: ${songPath}`);
    console.log(`Cover saved to: ${coverPath}`);

    res.status(200).json({
        success: true,
        message: 'Song uploaded successfully',
        data: { title, artist, songPath, coverPath }
    });
};

module.exports = {
    uploadMusic
};