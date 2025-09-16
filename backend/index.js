const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ DB Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "V@38080135k", 
  database: "greenlife"
});
db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");
});

// ✅ Create user table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    points INT DEFAULT 0
  )
`);

// ✅ Register
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Registered" });
    }
  );
});

// ✅ Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email=? AND password=?",
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(401).json({ message: "❌ Invalid credentials" });
      res.json(results[0]);
    }
  );
});

// ✅ Dashboard info
app.get("/api/dashboard/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id=?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// ✅ Log activity (earn points)
app.post("/api/activity", (req, res) => {
  const { userId, type } = req.body;
  let points = 0;
  if (type === "recycle") points = 10;
  if (type === "transport") points = 5;

  db.query("UPDATE users SET points = points + ? WHERE id=?", [points, userId], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "✅ Activity logged", pointsEarned: points });
  });
});

// ✅ Run server
app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));
