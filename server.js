const express = require('express');
// import and require mysql2
const mysql = require('mysql2');

const app = express ();
const PORT = process.env.PORT || 3003;


//express middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// creating connection to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password:'123',
    database: 'employees_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to employees_db database.');
});

app.get('/departments', (req, res) => {
  db.query('SELECT * FROM department', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
    }
  });
});

app.get('/role', (req, res) => {
  db.query('SELECT * FROM role', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
    }
  });
});

app.get('/employees', (req, res) => {
  db.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(results);
    }
  });
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});