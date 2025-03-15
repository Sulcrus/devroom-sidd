import mysql from 'mysql2/promise';

// Create a connection pool instead of single connections
const pool = mysql.createPool({
  host: process.env.DB_HOST || '95.217.203.22',
  user: process.env.DB_USER || 'khojekoj_sidd',
  password: process.env.DB_PASSWORD || 'Aaryu0629',
  database: process.env.DB_NAME || 'khojekoj_sidd',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function query({
  query,
  values = []
}: {
  query: string;
  values?: any[];
}) {
  try {
    const [results] = await pool.execute(query, values);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Add retry logic for connection issues
async function testConnection(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      connection.release();
      console.log('Database connection successful');
      return;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// Initialize connection
testConnection().catch(error => {
  console.error('Failed to establish database connection:', error);
  process.exit(1);
});

// Handle cleanup on app shutdown
process.on('SIGTERM', async () => {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (err) {
    console.error('Error closing pool:', err);
  }
});

export default pool;