const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;

// Create SQLite database connection
const db = new sqlite3.Database('mydatabase.db');

// Create a table if not exists
db.run('CREATE TABLE IF NOT EXISTS items (sno INTEGER PRIMARY KEY, code TEXT, links TEXT)');

// Express middleware to enable CORS
app.use(cors());

// Express middleware to parse JSON requests
app.use(express.json());

// Define routes
app.get('/items', (req, res) => {
    // Fetch all items from the database
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ items: rows });
    });
});

app.post('/items', (req, res) => {
    const { code, links } = req.body;

    // Insert a new item into the database
    db.run('INSERT INTO items (code, links) VALUES (?, ?)', [code, links], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ itemId: this.lastID });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
