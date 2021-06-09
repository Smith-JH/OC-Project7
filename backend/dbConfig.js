const mysql = require("mysql");

let dbConfig = ({
  host     : 'localhost',
  user     : 'webUser',
  password : 'password123',
  port     : '3306',
  database : 'project7app',
  multipleStatements: true
});

let connection = mysql.createConnection(dbConfig);

connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL...');
});

module.exports = connection