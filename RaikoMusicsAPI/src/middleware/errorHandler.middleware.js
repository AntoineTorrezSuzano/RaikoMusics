const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    console.error("An error occurred:", err.message);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: err.message });
    }

    if (err) {
        return res.status(400).json({ success: false, message: err.message });
    }

    // Fallback for unexpected errors
    res.status(500).json({
        success: false,
        message: 'An internal server error occurred.'
    });
};

module.exports = errorHandler;