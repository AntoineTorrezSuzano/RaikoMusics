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
        const albumId = Date.now().toString();
        const albumPath = path.join(UPLOADS_DIR, albumId);
        fs.mkdirSync(albumPath, { recursive: true });
        cb(null, albumPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('song'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }
    console.log(`Received new offering: ${req.file.path}`);
    res.status(200).send(`Song uploaded successfully to ${req.file.path}`);
});

app.listen(PORT, () => {
    console.log(`Offering hall is open and listening on port ${PORT}`);
});
