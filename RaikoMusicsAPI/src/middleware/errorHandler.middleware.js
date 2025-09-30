const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof multer.MulterError) {
        let message = 'An error occurred during file upload.';
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'File is too large. Please upload a smaller file.';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            message = 'You have attempted to upload too many files.';
        }
        return res.status(400).json({ success: false, message: message });
    }
    // falback for unexpected errors
    res.status(500).json({
        success: false,
        message: 'An internal server error occurred.'
    });
};

module.exports = { errorHandler };