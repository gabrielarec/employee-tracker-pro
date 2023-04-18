const express = require('express');
const mysql = require('mysql2');

application.use(express.urlencoded({extended:false}));
application.use(express.json());

// creating connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'123',
    database: 'test'
  });