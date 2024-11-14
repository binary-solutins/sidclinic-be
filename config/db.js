require('dotenv').config();  // Load .env variables

const mysql = require('mysql2');

// Create a connection pool with environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,  // Use the host from the .env file
  user: process.env.DB_USER,  // Use the username from the .env file
  password: process.env.DB_PASS,  // Use the password from the .env file
  database: process.env.DB_NAME,  // Use the database name from the .env file
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000,  // 10 seconds
  acquireTimeout: 10000,  // 10 seconds
  timeout: 10000  // 10 seconds
});

// Create a promisified pool for async operations
const promisePool = pool.promise();

// Initialize database
const initDatabase = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users2 (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        specialty VARCHAR(255),
        bio TEXT
      );
    `;
    await promisePool.query(createTableQuery);
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Initialize the database when the module loads
initDatabase();

// Export database methods with timeout handling
module.exports = {
  query: (sql, values) => {
    return new Promise((resolve, reject) => {
      const queryTimeout = setTimeout(() => {
        reject(new Error('Database query timeout'));
      }, 15000); // 15 seconds timeout

      pool.query(sql, values, (err, results) => {
        clearTimeout(queryTimeout);
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  
  checkConnection: async () => {
    try {
      await promisePool.query('SELECT 1');
      return true;
    } catch (err) {
      console.error('Database connection error:', err);
      return false;
    }
  },

  // Method to get pool statistics
  getPoolStatus: () => {
    return {
      threadId: pool.threadId,
      activeConnections: pool._allConnections.length,
      idleConnections: pool._freeConnections.length,
      waitingCount: pool._connectionQueue.length
    };
  }
};
