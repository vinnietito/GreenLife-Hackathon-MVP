const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//COnnecting to the database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "V@38080135kim",
    database: "greenlife"
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected...")
});

//Create user table if not exist
db.query(`
    CREATE TABLE IF NOT EXIST users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    points INT DEFAULT 0
    )
    `);

//Register
app.post("/api/register", (req, res) => {
    const { name, email, password } = req.body;
    db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Registered"});
        }
    );
});
