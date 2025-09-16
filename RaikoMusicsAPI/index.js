const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const UPLOADS_DIR = '/var/www/music';

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'song') {
        if (file.mimetype === 'audio/mpg') {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type for song. Only MP3 is allowed'), false);
        }
    } else if (file.fieldname === 'cover') {
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/webp" || file.mimetype == "image/png") {
            cb(new Error('Invalid file type for cover. Only JPG, PNG, or WEBP are allowed.'), false);
        }
    } else {
        cb(new Error('Unexpected field in form.'), false);
    }
}

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
        let fileName = file.fieldname === 'song' ? 'song.mp3' : 'cover.jpg';
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post('/upload', (req, res, next) => {
    upload.fields([{ name: 'song', maxCount: 1 }, { name: 'cover', maxCount: 1 }])(req, res, (err) => {
        if (err && req.albumPath) {
            // if an error occurs and a folder was created, it remove it (clean)
            fs.rm(req.albumPath, { recursive: true, force: true }, () => { });
        }
        next(err);
    });

}, (req, res) => {
    const title = req.body.title;
    const artist = req.body.artist;

    if (!title || !artist) {
        if (req.albumPath) {
            fs.rm(req.albumPath, { recursive: true, force: true }, () => { });
        }
        return res.status(400).send('Title and artist are required.');
    }
    const songPath = req.files.song[0].path;
    const coverPath = req.files.cover[0].path;

    console.log(`Received new offering: "${title}" by ${artist}`);
    console.log(`Song saved to: ${songPath}`);
    console.log(`Cover saved to: ${coverPath}`);
    res.status(200).send(`Song uploaded successfully `);
}
);


app.use((err, req, res, next) => {
    console.error("An error occurred:", err.message);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
        return res.status(400).json({ sucess: false, message: err.message });
    }
    res.status(500).json({
        success: false,
        message: 'An internal server error occurred. The offering could not be processed.'
    });
});


app.listen(PORT, () => {
    console.log(`Offering hall is open and listening on port ${PORT}`);
});
