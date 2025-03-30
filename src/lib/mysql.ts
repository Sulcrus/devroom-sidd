import mysql from 'mysql2/promise';
import config from './config';

// Create a pool using environment variables from config
const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function transaction<T>(
  callback: (connection: mysql.Connection) => Promise<T>
): Promise<T> {
  const connection = await mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
  });

  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.end();
  }
} 