import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'self_intro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 10000,
  acquireTimeout: 30000,
  timezone: '+08:00',
  charset: 'utf8mb4'
});

pool.on('connection', (connection) => {
  console.log('📦 New database connection established');
});

pool.on('release', (connection) => {
  // Connection released back to pool
});

pool.on('enqueue', () => {
  console.log('⏳ Waiting for available database connection');
});

setInterval(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
  } catch (error) {
    console.error('Database ping failed:', error.message);
  }
}, 60000);

export default pool;

export const executeQuery = async (sql, params = []) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const executeTransaction = async (callback) => {
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
};
