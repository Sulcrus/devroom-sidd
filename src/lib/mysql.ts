import mysql from 'mysql2/promise';
import { RowDataPacket, OkPacket, ResultSetHeader } from "mysql2";

const pool = mysql.createPool({
  host: '95.217.203.22',
  user: 'khojekoj_sidd',
  password: 'Aaryu0629',
  database: 'khojekoj_sidd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export type QueryResult = RowDataPacket[] | OkPacket | ResultSetHeader | ResultSetHeader[];

export async function query({
  query,
  values = []
}: {
  query: string;
  values?: any[];
}): Promise<QueryResult> {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || "3306"),
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    const [results] = await connection.execute(query, values);
    await connection.end();

    return results;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Database error");
  }
}

export async function transaction<T>(
  callback: (connection: mysql.Connection) => Promise<T>
): Promise<T> {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
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