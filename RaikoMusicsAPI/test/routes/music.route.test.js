const request = require('supertest');
const express = require('express');
const musicRouter = require('../../src/routes/music.route');

const musicController = require('../../src/controllers/music.controller');
const { handleUpload } = require('../../src/middleware/upload.middleware');

jest.mock('../../src/controllers/music.controller');
jest.mock('../../src/middleware/upload.middleware');

const app = express();
app.use(express.json());
app.use('/api/music', musicRouter);

describe('Music Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should route GET /api/music/get/list to the getMusicList controller', async () => {
        musicController.getMusicList.mockImplementation((req, res) => {
            res.status(200).json({ success: true });
        })

        await request(app)
            .get('/api/music/get/list')
            .expect(200);
        expect(musicController.getMusicList).toHaveBeenCalled();
    });

})