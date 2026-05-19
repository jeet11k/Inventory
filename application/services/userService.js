const bcrypt = require('bcrypt');

// In-memory user storage (can be replaced with database)
let users = [];

// Initialize admin user
async function initializeUsers() {
  const adminExists = users.some(u => u.username === 'admin');
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('Admin@2026', 10);
    users.push({
      id: 1,
      username: 'admin',
      passwordHash: hashedPassword
    });
    console.log('Admin user initialized');
  }
}

// Authenticate user
async function authenticateUser(username, password) {
  const user = users.find(u => u.username === username);
  if (!user) {
    return null;
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return null;
  }
  
  return {
    id: user.id,
    username: user.username
  };
}

// Get user by ID
function getUserById(id) {
  const user = users.find(u => u.id === id);
  if (!user) return null;
  return {
    id: user.id,
    username: user.username
  };
}

module.exports = {
  initializeUsers,
  authenticateUser,
  getUserById
};
