// 🔵 Configuración de conexión a Neon PostgreSQL
import { Pool } from "@neondatabase/serverless"

// Cliente tipo pg-pool (recomendado para queries dinámicos)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export default pool

// Helper para ejecutar queries
export async function query<T = unknown>(
  sqlQuery: string,
  params: (string | number | boolean | null)[] = []
): Promise<T[]> {
  try {
    const { rows } = await pool.query(sqlQuery, params)
    return rows as T[]
  } catch (error) {
    console.error("[DATABASE ERROR]", error)
    throw error
  }
}
