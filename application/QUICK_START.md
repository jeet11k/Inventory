# 🚀 QUICK SETUP GUIDE - 3 MINUTES TO RUNNING

## Step 1️⃣: Open Terminal

```bash
cd "D:\Jeet\Python Project\application"
```

## Step 2️⃣: Install & Start

```bash
npm install && npm start
```

**OR use the startup script:**
```bash
Double-click: START.bat
```

## Step 3️⃣: Open Browser

```
http://localhost:3000
```

---

## 🔑 Login with These Credentials

```
Username: admin
Password: Admin@2026
```

---

## 📍 Expected Behavior

```
1. Visit http://localhost:3000
   ↓
2. Automatically redirected to Login page
   ↓
3. Enter credentials → Click "Sign In"
   ↓
4. Redirected to Dashboard
   ↓
5. See inventory items
   ↓
6. Click "Logout" → Back to Login
```

---

## ✅ Console Output Should Show

```
Server running at http://localhost:3000
Connected to SQLite database
Inventory table ready
Admin user initialized
```

---

## 📁 What Was Added

| File | Purpose |
|------|---------|
| `login.html` | Login page with Bootstrap UI |
| `dashboard.html` | Protected dashboard |
| `middleware/authMiddleware.js` | Route protection |
| `services/userService.js` | Authentication logic |
| `AUTHENTICATION_GUIDE.md` | Detailed documentation |
| `README_AUTHENTICATION.md` | Quick reference |
| `IMPLEMENTATION_SUMMARY.md` | What was implemented |
| `START.bat` | One-click startup |

---

## 🎯 Key Features

✅ Login redirect on startup
✅ Bcrypt password hashing
✅ Session-based auth
✅ All routes protected
✅ Bootstrap UI
✅ Error messages
✅ Logout functionality
✅ Auto 24-hour expiry

---

## 🔐 How It Works

```
Server starts
    ↓
Creates "admin" user (password hashed)
    ↓
User visits site
    ↓
Gets redirected to /login
    ↓
Enters admin / Admin@2026
    ↓
Password verified with bcrypt
    ↓
Session created
    ↓
Redirected to /dashboard
    ↓
All API calls work
    ↓
Click logout → Session destroyed
```

---

## 📝 Files Modified

- ✏️ `package.json` - Added bcrypt & express-session
- ✏️ `server.js` - Added auth routes & protection

---

## 🧪 Quick Test

**In another terminal:**

```bash
# Test valid login
curl -X POST http://localhost:3000/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"Admin@2026\"}"

# Should return:
# {"message":"Login successful","user":{"id":1,"username":"admin"}}
```

---

## ❓ Can't Login?

1. ✅ Verify server is running
2. ✅ Check credentials: `admin` / `Admin@2026`
3. ✅ Clear browser cookies
4. ✅ Check terminal for errors

---

## 📚 Full Documentation

- **AUTHENTICATION_GUIDE.md** - Everything you need to know
- **README_AUTHENTICATION.md** - FAQ & troubleshooting
- **IMPLEMENTATION_SUMMARY.md** - What was done & why

---

## 🚀 You're Ready!

```bash
1. npm install
2. npm start
3. Visit http://localhost:3000
4. Login with admin / Admin@2026
5. Enjoy your secure inventory system!
```

---

**Questions?** Check the documentation files or review server console output.
