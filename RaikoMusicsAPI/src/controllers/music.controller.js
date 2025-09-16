const fs = require('fs');
const path = require('path');
const config = require('../config');

const uploadMusic = async (req, res, next) => {
    try {
        const { title, artist } = req.body;

        // Check for required text fields
        if (!title || !artist) {
            // If validation fails after upload, clean up the created folder
            if (req.albumPath) {
                await fs.rm(req.albumPath, { recursive: true, force: true }, () => { });
            }
            return res.status(400).json({ success: false, message: 'Title and artist are required.' });
        }

        // Check if files were actually uploaded
        if (!req.files || !req.files.song || !req.files.cover) {
            if (req.albumPath) {
                await fs.rm(req.albumPath, { recursive: true, force: true }, () => { });
            }
            return res.status(400).json({ success: false, message: 'Both a song and a cover image are required.' });
        }

        const songPath = req.files.song[0].path;
        const coverPath = req.files.cover[0].path;

        const metadata = {
            title: title,
            artist: artist,
            songFile: req.files.song[0].filename,
            coverFile: req.files.cover[0].filename
        };

        await fs.writeFile(path.join(req.albumPath, 'metadata.json'), JSON.stringify(metadata, null, 2));

        console.log(`Received new offering: "${title}" by ${artist}`);
        console.log(`Song saved to: ${songPath}`);
        console.log(`Cover saved to: ${coverPath}`);

        res.status(201).json({ // 201 is for new resources
            success: true,
            message: 'Song uploaded successfully',
            data: metadata
        });
    } catch (error) {
        next(error)
    }
};

const getMusicList = async (req, res, next) => {
    try {
        const musicFolders = await fs.readdir(config.UPLOADS_DIR);

        const allMusicData = await Promise.all(
            musicFolders.map(async (folderId) => {
                try {
                    const metadataPath = path.join(config.UPLOADS_DIR, folderId, 'metadata.json');
                    const fileContent = await fs.readFile(metadataPath);
                    const metadata = JSON.parse(fileContent);

                    return {
                        id: folderId,
                        title: metadata.title,
                        artist: metadata.artist,
                    };
                } catch (error) {
                    console.error(`Could not process folder ${folderId}:`, error);
                    return null;
                }
            })
        );

        const validMusic = allMusicData.filter(item => item !== null);

        res.status(200).json({
            success: true,
            data: validMusic
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    uploadMusic,
    getMusicList
};