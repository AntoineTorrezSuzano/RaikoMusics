const express = require('express');
const path = require('path');
const app = express();
const port = 80;

// Serve static files from the current directory (__dirname)
app.use(express.static(__dirname));

// For any other request, send the index.html file from the current directory
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});