# Authentication Implementation - Complete Setup Guide

## 🎯 Overview
Your Inventory Management System now includes complete authentication with login/logout functionality, session management, and bcrypt password hashing.

---

## ✨ Features Implemented

✅ **Login Page** - Bootstrap-based responsive login UI
✅ **Session Management** - Using express-session with 24-hour expiry
✅ **Password Hashing** - Bcrypt for secure password storage
✅ **Route Protection** - All API routes require authentication
✅ **Dashboard** - Protected dashboard page after login
✅ **Logout** - Secure session destruction on logout
✅ **Error Handling** - User-friendly error messages

---

## 🔐 Default Credentials

```
Username: admin
Password: Admin@2026
```

---

## 📦 Installation & Setup

### Step 1: Install Dependencies

```bash
cd "D:\Jeet\Python Project\application"
npm install
```

The following packages were added to `package.json`:
- **express-session** - Session management
- **bcrypt** - Password hashing and verification

### Step 2: Start the Server

```bash
npm start
```

Expected output:
```
Server running at http://localhost:3000
Connected to SQLite database
Inventory table ready
Admin user initialized
```

### Step 3: Access the Application

Open your browser and go to: `http://localhost:3000`

You will be automatically redirected to the login page.

---

## 🔑 How Authentication Works

### 1. **Login Flow**
   - User navigates to `/login`
   - Enters username and password
   - System hashes the password using bcrypt
   - If valid, session is created with `userId`
   - User is redirected to `/dashboard`

### 2. **Route Protection**
   - All inventory API routes require authentication
   - Middleware checks if `req.session.userId` exists
   - If not authenticated, redirects to `/login`

### 3. **Logout Flow**
   - User clicks logout button
   - Session is destroyed on server
   - User is redirected to `/login`

### 4. **Session Management**
   - Sessions stored in memory (can be persisted to database)
   - 24-hour expiry time
   - HTTP-only cookies for security

---

## 📁 New Files & Structure

```
application/
├── server.js                    (Updated with auth routes)
├── login.html                   (Login page UI)
├── dashboard.html               (Protected dashboard)
├── middleware/
│   └── authMiddleware.js        (Authentication middleware)
└── services/
    └── userService.js           (User authentication logic)
```

---

## 🛣️ Authentication Routes

### Public Routes (No Auth Required)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/login` | Serve login page |
| POST | `/login` | Authenticate user and create session |
| POST | `/logout` | Destroy session and logout |
| GET | `/` | Redirect to login or dashboard |

### Protected Routes (Auth Required)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard` | Serve protected dashboard |
| GET | `/api/user` | Get current user info |
| GET | `/api/inventory` | Get all items |
| GET | `/api/inventory/:id` | Get single item |
| POST | `/api/inventory` | Create new item |
| PUT | `/api/inventory/:id` | Update item |
| DELETE | `/api/inventory/:id` | Delete item |
| GET | `/api/summary` | Get inventory summary |

---

## 🧪 Testing the Authentication

### Test 1: Access Login Page
```bash
curl http://localhost:3000/login
```

### Test 2: Login with Valid Credentials
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"Admin@2026\"}"
```

Expected Response:
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### Test 3: Login with Invalid Credentials
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"wrongpassword\"}"
```

Expected Response (401):
```json
{
  "message": "Invalid username or password"
}
```

### Test 4: Access Protected Route Without Auth
```bash
curl http://localhost:3000/api/inventory
```

Expected: 302 redirect to `/login`

---

## 🔐 Security Features

1. **Password Hashing**
   - Passwords are hashed with bcrypt (10 salt rounds)
   - Original password never stored
   - Salted hash makes rainbow table attacks infeasible

2. **Session Security**
   - HTTP-only cookies prevent XSS attacks
   - Session timeout after 24 hours
   - Session ID regenerated on login

3. **Route Protection**
   - Authentication middleware on all API routes
   - Server-side validation of credentials
   - Secure password comparison (timing attack resistant)

---

## 📝 Code Examples

### Authentication Middleware
```javascript
// Usage: app.get('/protected', isAuthenticated, handler)
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
};
```

### Login Handler
```javascript
app.post('/login', isNotAuthenticated, async (req, res) => {
  const { username, password } = req.body;
  const user = await authenticateUser(username, password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  
  req.session.userId = user.id;
  req.session.username = user.username;
  return res.json({ message: 'Login successful', user });
});
```

### Logout Handler
```javascript
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});
```

---

## 🔄 Adding More Users

Edit `services/userService.js` to add more users:

```javascript
async function initializeUsers() {
  const hashedPassword = await bcrypt.hash('newPassword', 10);
  users.push({
    id: 2,
    username: 'newuser',
    passwordHash: hashedPassword
  });
}
```

For production, store users in a database instead of memory.

---

## ⚙️ Production Recommendations

1. **Change Session Secret**
   ```javascript
   // In server.js, line 20
   secret: process.env.SESSION_SECRET || 'your-strong-secret-key'
   ```

2. **Use Database for Sessions**
   ```bash
   npm install connect-sqlite3
   ```

3. **Use HTTPS**
   ```javascript
   cookie: {
     secure: true,  // Requires HTTPS
     httpOnly: true,
     sameSite: 'strict'
   }
   ```

4. **Use Environment Variables**
   ```bash
   npm install dotenv
   ```

5. **Store Users in Database**
   - Create `users` table in SQLite
   - Hash passwords before storing
   - Verify credentials from database

6. **Add Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

---

## 🐛 Troubleshooting

### Issue: "Admin user initialized" not showing
- Check if `services/userService.js` is in the correct path
- Ensure bcrypt is installed: `npm list bcrypt`

### Issue: Cannot login
- Verify credentials: `admin` / `Admin@2026`
- Check server logs for errors
- Clear browser cookies and try again

### Issue: Session expires immediately
- Check `maxAge` setting in server.js (default: 24 hours)
- Verify session middleware is loaded before routes

### Issue: Routes not protected
- Ensure `isAuthenticated` middleware is applied to routes
- Check that middleware imports are correct

---

## 📚 File Modifications Summary

### 1. **package.json**
   - Added: `express-session` (^1.17.3)
   - Added: `bcrypt` (^5.1.1)

### 2. **server.js** (Major rewrite)
   - Added session middleware configuration
   - Added authentication routes (/login, /logout)
   - Added route protection middleware to all API endpoints
   - Added user info endpoint (/api/user)
   - Added root path redirect logic

### 3. **New Files Created**
   - `middleware/authMiddleware.js` - Authentication middleware
   - `services/userService.js` - User authentication logic
   - `login.html` - Login page with Bootstrap UI
   - `dashboard.html` - Protected dashboard page

---

## 🚀 Next Steps

1. Test the login with provided credentials
2. Create new inventory items after login
3. Add more users to `userService.js`
4. Deploy to production with security recommendations
5. Set up database for user management

---

## 📞 Support

For issues or questions:
1. Check the logs in terminal/console
2. Verify all files are created correctly
3. Ensure all dependencies are installed
4. Clear browser cache/cookies if needed

---

**✅ Authentication system is ready to use!**

Visit: `http://localhost:3000` to access your login page.
