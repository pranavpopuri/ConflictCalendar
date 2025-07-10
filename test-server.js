// Test script to check if routing works
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001; // Use different port for testing

// Test static file serving
const staticPath = path.join(__dirname, "frontend", "dist");
const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");

console.log('Testing static file paths:');
console.log('Static path:', staticPath);
console.log('Index path:', indexPath);
console.log('Static exists:', fs.existsSync(staticPath));
console.log('Index exists:', fs.existsSync(indexPath));

if (fs.existsSync(staticPath)) {
    console.log('Static files:', fs.readdirSync(staticPath));

    // Serve static files
    app.use(express.static(staticPath));

    // Test routes
    app.get('/', (req, res) => {
        console.log('Serving root route');
        res.sendFile(indexPath);
    });

    app.get('/reset-password', (req, res) => {
        console.log('Serving reset-password route');
        res.sendFile(indexPath);
    });

    app.listen(PORT, () => {
        console.log(`Test server running on http://localhost:${PORT}`);
        console.log(`Try: http://localhost:${PORT}/reset-password`);
    });
} else {
    console.log('Static files not found!');
}
