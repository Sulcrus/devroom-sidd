import mysql from 'mysql2/promise';
import { RowDataPacket } from "mysql2";

// Define more specific types for query results
export interface QueryResultRow extends RowDataPacket {
  [key: string]: any;
}

export type QueryResult<T = QueryResultRow> = T[];
export type QueryResultSingle<T = QueryResultRow> = T | null;

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false }
    : undefined
});

// Verify database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('Database connection failed:', error);
  });

export async function query<T = QueryResultRow>({
  sql,
  values = []
}: {
  sql: string;
  values?: any[];
}): Promise<QueryResult<T>> {
  try {
    const [rows] = await pool.execute(sql, values);
    return rows as QueryResult<T>;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Database operation failed");
  }
}

export async function querySingle<T = QueryResultRow>({
  sql,
  values = []
}: {
  sql: string;
  values?: any[];
}): Promise<QueryResultSingle<T>> {
  const rows = await query<T>({ sql, values });
  return rows[0] || null;
}

export async function transaction<T>(
  callback: (connection: mysql.Connection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
} 