import mysql from 'mysql2/promise';

// Track active connections
let activeConnections = 0;
const MAX_CONNECTIONS = 10;

const pool = mysql.createPool({
  host: process.env.DB_HOST || '95.217.203.22',
  user: process.env.DB_USER || 'khojekoj_sidd',
  password: process.env.DB_PASSWORD || 'Aaryu0629',
  database: process.env.DB_NAME || 'khojekoj_sidd',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: MAX_CONNECTIONS,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
});

// Monitor pool events
pool.on('connection', () => {
  activeConnections++;
  console.log(`New connection established. Active connections: ${activeConnections}`);
});

pool.on('release', () => {
  activeConnections--;
  console.log(`Connection released. Active connections: ${activeConnections}`);
});

export async function query({
  query,
  values = []
}: {
  query: string;
  values?: any[];
}) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(query, values);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to close idle connections
async function closeIdleConnections() {
  try {
    const connections = await pool.query('SHOW PROCESSLIST');
    const idleConnections = (connections as any[]).filter(
      conn => conn.Command === 'Sleep' && conn.Time > 30
    );

    for (const conn of idleConnections) {
      await pool.query(`KILL ${conn.Id}`);
      console.log(`Closed idle connection: ${conn.Id}`);
    }
  } catch (error) {
    console.error('Error closing idle connections:', error);
  }
}

// Periodically check and close idle connections
setInterval(closeIdleConnections, 60000); // Check every minute

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
    // Close idle connections first
    await closeIdleConnections();
    // Then end the pool
    await pool.end();
    console.log('Database pool closed');
  } catch (err) {
    console.error('Error closing pool:', err);
  }
});

// Handle cleanup on app exit
process.on('exit', () => {
  if (pool) {
    pool.end();
    console.log('Database pool closed on exit');
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('Uncaught exception:', err);
  try {
    await pool.end();
    console.log('Database pool closed due to uncaught exception');
  } catch (error) {
    console.error('Error closing pool:', error);
  }
  process.exit(1);
});

export default pool;