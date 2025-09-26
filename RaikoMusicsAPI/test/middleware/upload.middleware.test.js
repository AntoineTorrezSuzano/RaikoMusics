const multer = require('multer');
const path = require('path');
const fs = require('fs');

const config = require('../../src/config');
const { handleUpload, fileFilter, storage } = require('../../src/middleware/upload.middleware');

var mockUploader;
jest.mock('multer', () => {
    mockUploader = jest.fn();

    const multerFn = jest.fn(() => ({ fields: jest.fn().mockReturnValue(mockUploader) }))
    multerFn.diskStorage = jest.fn(opts => opts);

    return multerFn;
});

jest.mock('fs', () => ({
    rm: jest.fn(),
    mkdirSync: jest.fn(),
}));
jest.mock('../../src/config', () => ({
    UPLOADS_DIR: '/fake/uploads/dir',
}));


describe('Upload Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call next() with no arguments on successful upload", () => {
        const req = {};
        const res = {};
        const next = jest.fn();
        mockUploader.mockImplementation((req, res, callback) => {
            callback(null);
        });

        handleUpload(req, res, next);

        expect(next).toHaveBeenCalledWith();
        expect(fs.rm).not.toHaveBeenCalled();
    })

    it('should call next(err) with an error when upload fails and no directory was created', () => {
        const err = new Error("File too large(fake test error)");
        const req = {};
        const res = {};
        const next = jest.fn();
        mockUploader.mockImplementation((req, res, callback) => {
            callback(err)
        })
        handleUpload(req, res, next);

        expect(next).toHaveBeenCalledWith(err);
        expect(fs.rm).not.toHaveBeenCalled();
    })
    it('should call fs.rm and next(err) when upload fails and a directory was created', () => {
        const err = new Error("File too large(fake test error)");
        const req = { albumPath: config.UPLOADS_DIR };
        const res = {};
        const next = jest.fn();
        mockUploader.mockImplementation((req, res, callback) => {
            callback(err)
        })
        handleUpload(req, res, next);

        expect(next).toHaveBeenCalledWith(err);
        expect(fs.rm).toHaveBeenCalledWith(req.albumPath, { recursive: true, force: true }, expect.any(Function));
    })
    // _____FILEFILTER FUNCTION______
    it('should call cb(null, true) when file.fieldname is equal to song & file.mimetype is equal to audio/mpeg', () => {
        const req = {};
        const file = { fieldname: "song", mimetype: "audio/mpeg" }
        const cb = jest.fn();

        fileFilter(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, true);
    })
    it('should call cb(new Error...) when file.fieldname is equal to song & file.mimetype is not equal to audio/mpeg', () => {
        const req = {};
        const file = { fieldname: "song", mimetype: "audio/notmpeg" };
        const cb = jest.fn();

        fileFilter(req, file, cb);

        expect(cb).toHaveBeenCalledWith(new Error('Invalid file type for song. Only MP3 is allowed'), false);
    })
    it('should call cb(null, true) when file.fieldname is equal to cover & file.mimetype include image/jpeg', () => {
        const req = {};
        const file = { fieldname: "cover", mimetype: "image/jpeg" }
        const cb = jest.fn();

        fileFilter(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, true);
    })
    it('should call cb(null, true) when file.fieldname is equal to cover & file.mimetype include image/webp', () => {
        const req = {};
        const file = { fieldname: "cover", mimetype: "image/webp" }
        const cb = jest.fn();

        fileFilter(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, true);
    })
    it('should call cb(null, true) when file.fieldname is equal to cover & file.mimetype include image/png', () => {
        const req = {};
        const file = { fieldname: "cover", mimetype: "image/png" }
        const cb = jest.fn();

        fileFilter(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, true);
    })
    it('should call cb(new Error...) when file.fieldname is equal to cover & file.mimetype does not include image/jpeg or image/webp or image/png', () => {
        const req = {};
        const file = { fieldname: "cover", mimetype: "image/unauthorizedtype" };
        const cb = jest.fn();

        fileFilter(req, file, cb);

        expect(cb).toHaveBeenCalledWith(new Error('Invalid file type for cover. Only JPG, PNG, or WEBP are allowed.'), false);
    })
    it('should call cb(new Error...) when file.fieldname is not equal to song and is not equal to cover', () => {
        const req = {};
        const file = { fieldname: "wrongfiledname", mimetype: "notusedmimetype" };
        const cb = jest.fn();

        fileFilter(req, file, cb);

        expect(cb).toHaveBeenCalledWith(new Error('Unexpected field in form.'), false);
    })


})

describe('upload.middleware.js storage', () => {
    // ______STORAGE FUNCTION_____
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should create a new albumPath and call mkdirSync if req.albumPath does not exist', () => {
        const req = {};
        const file = {};
        const cb = jest.fn();

        jest.spyOn(Date, 'now').mockReturnValue(12345);
        jest.spyOn(Math, 'random').mockReturnValue(0.6789);
        const expectedAlbumId = '12345-678900000';
        const expectedPath = path.join(config.UPLOADS_DIR, expectedAlbumId);

        storage.destination(req, file, cb);

        expect(req.albumPath).toBe(expectedPath);
        expect(fs.mkdirSync).toHaveBeenCalledWith(expectedPath, { recursive: true });
        expect(cb).toHaveBeenCalledWith(null, expectedPath);

    })
    it('should callback (null, req.albumPath) if req.albumPath exists', () => {
        const fakeAlbumPath = "fake/albumPath";
        const req = { albumPath: fakeAlbumPath };
        const file = {};
        const cb = jest.fn();

        storage.destination(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, fakeAlbumPath);

    })
    it('should create a fileName equal to song.mp3 if the file.fieldname is equal to song', () => {
        const req = {};
        const file = { fieldname: "song" };
        const cb = jest.fn();

        storage.filename(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, "song.mp3");
    })
    it('should create a fileName equal to cover.jpg if the file.fieldname is not equal to song', () => {
        const req = {};
        const file = { fieldname: "cover" };
        const cb = jest.fn();

        storage.filename(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, "cover.jpg");
    })

})