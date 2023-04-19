const express = require('express');
// import and require mysql2
const mysql = require('mysql2');

application.use(express.urlencoded({extended:false}));
application.use(express.json());

// Express 
app.use(express.json());

// creating connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'123',
    database: 'employees_db'
  },
  console.log('Connected to employees_db database.')
  );

  app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
  });