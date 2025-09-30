const multer = require('multer');
const { errorHandler } = require('../../src/middleware/errorHandler.middleware');

jest.fn(multer.MulterError);
describe('errorHandler', () => {
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });
    it('Should respond with an status 500 and a conresponding error message for an unexpected error', () => {
        const err = new Error("That's an error yea");
        errorHandler(err, mockRequest, mockResponse, nextFunction);


        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'An internal server error occurred.' });
    })
    it('Should respond with an status 400 for a multerError with code LIMIT_FILE_SIZE', () => {
        const err = new multer.MulterError('LIMIT_FILE_SIZE')

        errorHandler(err, mockRequest, mockResponse, nextFunction);


        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'File is too large. Please upload a smaller file.' });
    })
    it('Should respond with an status 400 for a multerError with code LIMIT_FILE_COUNT', () => {
        const err = new multer.MulterError('LIMIT_FILE_COUNT')

        errorHandler(err, mockRequest, mockResponse, nextFunction);


        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'You have attempted to upload too many files.' });
    })
    it('Should respond with an status 400 for a multerError with code other than LIMIT_FILE_COUNT or LIMIT_FILE_SIZE', () => {
        const err = new multer.MulterError('LIMIT_FIELD_VALUE')

        errorHandler(err, mockRequest, mockResponse, nextFunction);


        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'An error occurred during file upload.' });
    })

})


