// src/middleware/upload.middleware.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'song') {
        if (file.mimetype === 'audio/mpeg') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for song. Only MP3 is allowed'), false);
        }
    } else if (file.fieldname === 'cover') {
        if (["image/jpeg", "image/webp", "image/png"].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for cover. Only JPG, PNG, or WEBP are allowed.'), false);
        }
    } else {
        cb(new Error('Unexpected field in form.'), false);
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (!req.albumPath) {
            const albumId = Date.now().toString() + '-' + Math.round(Math.random() * 1E9);
            req.albumPath = path.join(config.UPLOADS_DIR, albumId);
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

// This custom middleware calls multer and handles its specific errors, including cleanup
const handleUpload = (req, res, next) => {
    const uploader = upload.fields([{ name: 'song', maxCount: 1 }, { name: 'cover', maxCount: 1 }]);

    uploader(req, res, (err) => {
        // If multer throws an error and we created a directory, remove it
        if (err && req.albumPath) {
            fs.rm(req.albumPath, { recursive: true, force: true }, () => { });
        }
        // Pass the error to the global error handler
        next(err);
    });
};

module.exports = { handleUpload };