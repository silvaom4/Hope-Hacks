const mysql = require('mysql2'); //import my sql module

//initialize connection
const connection = mysql.createConnection({
host: 'localhost',
 database: 'HopeHacks',
 user: 'root', 
 password: 'password',
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('MySQL Database is Connected!!!!');
   });

module.exports = connection