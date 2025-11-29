// 🔵 Configuración de conexión a MySQL
import mysql from "mysql2/promise";

if (!process.env.MYSQL_HOST || !process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
  throw new Error("Faltan variables de entorno para la conexión a MySQL");
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,       // ej: 127.0.0.1
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER,       // ej: root
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

// Helper para ejecutar queries
export async function query<T = unknown>(
  sqlQuery: string,
  params: (string | number | boolean | null)[] = []
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sqlQuery, params);
    return rows as T[];
  } catch (error) {
    console.error("[DATABASE ERROR]", error);
    throw error;
  }
}
