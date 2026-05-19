# Inventory Management App

A full-stack hardware inventory management application with Node.js backend and SQLite database.

## Features

- **Dashboard**: View total inventory counts by category
- **Inventory List**: Browse all items with category filters and search functionality
- **Add/Edit Items**: Create and modify inventory items with validation
- **Delete Items**: Remove items from inventory
- **Real-time Updates**: All changes are persisted to SQLite database
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Database**: SQLite3
- **Port**: 3000 (configurable via `PORT` environment variable)

## Installation & Setup

### Prerequisites
- Node.js (v14+) and npm installed

### Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open in browser**:
   - Navigate to `http://localhost:3000`
   - The SQLite database (`inventory.db`) will be created automatically
   - Initial data is seeded on first run

## Project Structure

```
application/
├── index.html          # Main HTML page
├── style.css           # Styling
├── app.js              # Frontend JavaScript logic
├── server.js           # Express backend server
├── package.json        # Dependencies
└── inventory.db        # SQLite database (auto-created)
```

## API Endpoints

### Get all items
```
GET /api/inventory
```

### Get inventory summary
```
GET /api/summary
```

### Get single item
```
GET /api/inventory/:id
```

### Create new item
```
POST /api/inventory
Body: {
  "name": "Item Name",
  "category": "Laptop|Desktop|Phone",
  "quantity": 5,
  "location": "Warehouse A",
  "status": "Available|Assigned|In Repair",
  "notes": "Optional notes"
}
```

### Update item
```
PUT /api/inventory/:id
Body: Same as POST
```

### Delete item
```
DELETE /api/inventory/:id
```

## Database Schema

### Inventory Table
```sql
CREATE TABLE inventory (
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
```

## Usage

1. **View Dashboard**: See total counts of all items by category
2. **Filter Items**: Use category dropdown to filter by Laptop, Desktop, or Phone
3. **Search Items**: Type in search box to find items by name
4. **Add Item**: Fill out form and click "Save Item"
5. **Edit Item**: Click "Edit" button on any item to modify it
6. **Delete Item**: Click "Delete" button to remove an item (confirmation required)

## Configuration

The server runs on port 3000 by default. To change the port:

```bash
PORT=5000 npm start
```

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running.

## Initial Data

The app comes pre-loaded with 3 sample items:
- Latitude 7420 (Laptop, 12 units)
- Optiplex 7090 (Desktop, 8 units)
- Galaxy S23 (Phone, 18 units)

These are only added on first run if the database is empty.

## Troubleshooting

**Port already in use**: Change the PORT environment variable
```bash
PORT=3001 npm start
```

**Database errors**: Delete `inventory.db` and restart - it will be recreated with initial data

**CORS errors**: The server includes CORS middleware - ensure requests are from `http://localhost:3000`

## Future Enhancements

- User authentication and authorization
- Bulk import/export (CSV)
- Advanced filtering and sorting
- Inventory history/audit logs
- Email notifications for low stock
- Unit testing and CI/CD pipeline
