const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const UPLOADS_DIR = '/var/www/music';

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (!req.albumPath) {
            const albumId = Date.now().toString() + '-' + Math.round(Math.random() * 1E9);
            req.albumPath = path.join(UPLOADS_DIR, albumId);
            fs.mkdirSync(req.albumPath, { recursive: true });
        }
        cb(null, req.albumPath);
    },
    filename: function (req, file, cb) {
        let fileName;
        if (file.mimetype == "audio/mpeg") {
            fileName = "song.mp3";
        } else if (file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/png") {
            fileName = "cover.jpg";
        } else {
            return cb(new Error('Unsupported file type!'));
        }
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.fields([
    { name: 'song', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
]), (req, res) => {

    const title = req.body.title;
    const artist = req.body.artist;

    if (!title) {
        return res.status(400).send('Title is required.');
    }
    if (!artist) {
        return res.status(400).send('Artist is required.');
    }
    const songPath = req.files.song[0].path;
    const coverPath = req.files.cover[0].path;

    console.log(`Received new offering: "${title}" by ${artist}`);
    console.log(`Song saved to: ${songPath}`);
    console.log(`Cover saved to: ${coverPath}`);
    res.status(200).send(`Song uploaded successfully`);
});

app.listen(PORT, () => {
    console.log(`Offering hall is open and listening on port ${PORT}`);
});
