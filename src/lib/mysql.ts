import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '95.217.203.22',
  user: 'khojekoj_sidd',
  password: 'Aaryu0629',
  database: 'khojekoj_sidd',
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