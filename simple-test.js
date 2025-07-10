const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Test static file serving
const staticPath = path.join(__dirname, "frontend", "dist");
const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");

console.log('Static path:', staticPath);
console.log('Index path:', indexPath);
console.log('Static exists:', fs.existsSync(staticPath));
console.log('Index exists:', fs.existsSync(indexPath));

// API routes first
app.get('/api/test', (req, res) => {
    res.json({ message: 'API working' });
});

// Static files
app.use(express.static(staticPath));

// SPA routes
const spaRoutes = ['/', '/reset-password', '/login', '/signup'];
spaRoutes.forEach(route => {
    app.get(route, (req, res) => {
        console.log(`Serving ${route}`);
        res.sendFile(indexPath);
    });
});

app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
    console.log(`Test reset password: http://localhost:${PORT}/reset-password`);
});
