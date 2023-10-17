const my = require("./db_key");

var mysql = require("mysql2");
var db = mysql.createConnection({
  host: my.host,
  user: my.user,
  password: my.password,
  database: my.database,
});
db.connect();

module.exports = db;
