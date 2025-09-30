const express = require("express");
const musicController = require('../controllers/music.controller');
const { handleUpload } = require('../middleware/upload.middleware')

const router = express.Router();

// /api/music/
router.post("/upload", handleUpload, musicController.uploadMusic);
router.get("/get/list", musicController.getMusicList)
router.delete("/delete/:id", musicController.deleteMusicById)

module.exports = router;