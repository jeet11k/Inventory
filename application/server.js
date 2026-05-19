const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'inventory.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      location TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating table:', err);
    else {
      console.log('Inventory table ready');
      seedInitialData();
    }
  });
}

// Seed initial data if table is empty
function seedInitialData() {
  db.get('SELECT COUNT(*) as count FROM inventory', (err, row) => {
    if (row.count === 0) {
      const initialData = [
        ['Latitude 7420', 'Laptop', 12, 'Warehouse A', 'Available', 'Dell business laptop'],
        ['Optiplex 7090', 'Desktop', 8, 'Office B', 'Assigned', 'Desktop workstation'],
        ['Galaxy S23', 'Phone', 18, 'Mobile Rack', 'In Repair', 'Samsung mobile device']
      ];

      const insertStmt = db.prepare('INSERT INTO inventory (name, category, quantity, location, status, notes) VALUES (?, ?, ?, ?, ?, ?)');
      initialData.forEach(item => insertStmt.run(item));
      insertStmt.finalize(() => console.log('Initial data seeded'));
    }
  });
}

// Routes

// Get all inventory items
app.get('/api/inventory', (req, res) => {
  db.all('SELECT * FROM inventory ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get inventory summary
app.get('/api/summary', (req, res) => {
  db.all('SELECT COUNT(*) as total, category, SUM(quantity) as qty FROM inventory GROUP BY category', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    let summary = {
      total: 0,
      laptops: 0,
      desktops: 0,
      phones: 0
    };

    db.get('SELECT SUM(quantity) as total FROM inventory', (err, totalRow) => {
      if (totalRow) summary.total = totalRow.total || 0;

      rows.forEach(row => {
        if (row.category === 'Laptop') summary.laptops = row.qty || 0;
        if (row.category === 'Desktop') summary.desktops = row.qty || 0;
        if (row.category === 'Phone') summary.phones = row.qty || 0;
      });

      res.json(summary);
    });
  });
});

// Get single item
app.get('/api/inventory/:id', (req, res) => {
  db.get('SELECT * FROM inventory WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(row);
  });
});

// Create new item
app.post('/api/inventory', (req, res) => {
  const { name, category, quantity, location, status, notes } = req.body;

  if (!name || !category || !quantity || !location || !status) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const stmt = db.prepare('INSERT INTO inventory (name, category, quantity, location, status, notes) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run([name, category, quantity, location, status, notes || ''], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, message: 'Item created' });
  });
  stmt.finalize();
});

// Update item
app.put('/api/inventory/:id', (req, res) => {
  const { name, category, quantity, location, status, notes } = req.body;

  if (!name || !category || !quantity || !location || !status) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const stmt = db.prepare('UPDATE inventory SET name = ?, category = ?, quantity = ?, location = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  stmt.run([name, category, quantity, location, status, notes || '', req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item updated' });
  });
  stmt.finalize();
});

// Delete item
app.delete('/api/inventory/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM inventory WHERE id = ?');
  stmt.run([req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item deleted' });
  });
  stmt.finalize();
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error(err);
    process.exit(0);
  });
});
