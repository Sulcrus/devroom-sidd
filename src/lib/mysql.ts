import mysql from 'mysql2/promise';

// Create a connection pool instead of single connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
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

// Handle cleanup on app shutdown
process.on('SIGTERM', async () => {
  try {
    await pool.end();
    console.log('MySQL pool has ended');
  } catch (err) {
    console.error('Error closing MySQL pool:', err);
  }
});

export default pool; 
} 