const express = require("express");
const musicController = require('../controllers/music.controller');
const { handleUpload } = require('../middleware/upload.middleware')

const router = express.Router();

// POST /api/music/upload
router.post("/upload", handleUpload, musicController.uploadMusic);
router.get("/get/list", musicController.getMusicList)

module.exports = router;