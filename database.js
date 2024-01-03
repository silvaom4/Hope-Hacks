

const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'hopehacksdb.cvcq060maehe.us-east-2.rds.amazonaws.com',
  database: 'HopeHacks',
  user: 'admin',
  password: 'password',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0 
});

// Export the pool for use in other modules
module.exports = pool;

// get a connection from the pool whenever needed
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error getting connection from pool: ', err);
    return;
  }

  console.log('MySQL Database is Connected!!!!');

  // Do your database operations using the 'connection' object

  // Release the connection back to the pool when done
  connection.release();
});

