var mysql = require("mysql2");
var db = mysql.createConnection({
  host: "localhost",
  user: "User1",
  password: "12345678",
  database: "User",
});
db.connect();

module.exports = db;
