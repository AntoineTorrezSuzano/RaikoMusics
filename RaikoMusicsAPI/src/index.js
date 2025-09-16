const app = require('./app');
const config = require('./config');
const fs = require('fs');

// Ensure the main uploads directory exists on startup
try {
    fs.mkdirSync(config.UPLOADS_DIR, { recursive: true });
    console.log(`Uploads directory is ready at ${config.UPLOADS_DIR}`);
} catch (error) {
    console.error(`Error creating uploads directory: ${error.message}`);
    process.exit(1); // Exit if we can't create the essential directory
}

app.listen(config.PORT, () => {
    console.log(`RaikoMusics API is open and listening on port ${config.PORT}`);
});