require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  }
  console.log('✅ MySQL Connected...');
});

// Ensure users table exists
db.query(
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => { if (err) console.error('Table create error:', err); }
);

// Helper: remove password from user object
function sanitizeUser(row) {
  const { password, ...rest } = row;
  return rest;
}

// Register
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' });

  const hashed = bcrypt.hashSync(password, 10);

  db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already registered' });
      return res.status(500).json({ error: 'DB error', details: err });
    }
    return res.status(201).json({ message: '✅ Registered', userId: result.insertId });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token, user: sanitizeUser(user) });
  });
});

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Malformed Authorization header' });

  const token = parts[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = payload; // { id, email, iat, exp }
    next();
  });
}

// Dashboard (requires token) - endpoint kept as /api/dashboard/:id and checks token matches id
app.get('/api/dashboard/:id', authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  if (req.user.id !== id) return res.status(403).json({ error: 'Forbidden: token does not match user id' });

  db.query('SELECT id, name, email, points, created_at FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error("MySQL Error:", err); // log the actual error to your terminal
      return res.status(500).json({ error: err.sqlMessage || 'DB error' }); // return useful details
    }
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});


// Log activity (uses token; body { type })
app.post('/api/activity', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { type } = req.body;
  if (!type) return res.status(400).json({ error: 'type is required' });

  let points = 0;
  if (type === 'recycle') points = 10;
  else if (type === 'transport') points = 5;
  else return res.status(400).json({ error: 'Unknown activity type' });

  db.query('UPDATE users SET points = points + ? WHERE id = ?', [points, userId], (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    db.query('SELECT points FROM users WHERE id = ?', [userId], (err2, r) => {
      if (err2) return res.status(500).json({ error: 'DB error' });
      res.json({ message: '✅ Activity logged', pointsEarned: points, newPoints: r[0].points });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
