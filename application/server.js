const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { isAuthenticated, isNotAuthenticated } = require('./middleware/authMiddleware');
const { initializeUsers, authenticateUser, getUserById } = require('./services/userService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your-secret-key-change-this-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

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
  
  // Initialize authentication users
  initializeUsers().catch(err => console.error('Error initializing users:', err));
}

// Seed initial data if table is empty
function seedInitialData() {
  db.get('SELECT COUNT(*) as count FROM inventory', (err, row) => {
    if (row && row.count === 0) {
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

// ==================== Authentication Routes ====================

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login POST request (JSON)
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.username = user.username;

    return res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
});

// Get current user info
app.get('/api/user', isAuthenticated, (req, res) => {
  const user = getUserById(req.session.userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Handle logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

// Serve dashboard (protected)
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Redirect root to login or dashboard
app.get('/', (req, res) => {
  res.redirect('/login');
});

// ==================== Protected Inventory Routes ====================

// Get all inventory items (protected)
app.get('/api/inventory', isAuthenticated, (req, res) => {
  db.all('SELECT * FROM inventory ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get inventory summary (protected)
app.get('/api/summary', isAuthenticated, (req, res) => {
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

// Get single item (protected)
app.get('/api/inventory/:id', isAuthenticated, (req, res) => {
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

// Create new item (protected)
app.post('/api/inventory',(req, res) => {
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

// Update item (protected)
app.put('/api/inventory/:id', isAuthenticated, (req, res) => {
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

// Delete item (protected)
app.delete('/api/inventory/:id', isAuthenticated, (req, res) => {
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
