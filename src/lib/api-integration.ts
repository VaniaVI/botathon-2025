// 🔵 BLUE PRISM INTEGRATION POINT #1: Database Connection
// Este archivo define los puntos de integración con Blue Prism y la Base de Datos
// Blue Prism debe implementar estos endpoints para leer/escribir datos

/**
 * INSTRUCCIONES PARA INTEGRACIÓN CON BLUE PRISM:
 *
 * 1. BASE DE DATOS - Configurar la conexión en las variables de entorno:
 *    - DATABASE_URL: String de conexión a PostgreSQL/MySQL
 *    - Ejemplo: postgresql://user:password@localhost:5432/teleton_crm
 *
 * 2. BLUE PRISM - Crear los siguientes procesos RPA:
 *    a) Proceso de Inserción de Datos (data-ingestion.process)
 *       - Lee archivos CSV/Excel desde carpeta designada
 *       - Normaliza datos de voluntarios
 *       - Llama a POST /api/volunteers/bulk para insertar
 *
 *    b) Proceso de Búsqueda Inteligente (smart-search.process)
 *       - Recibe parámetros de filtrado
 *       - Llama a GET /api/volunteers/search
 *       - Retorna resultados en < 10 segundos
 *
 *    c) Proceso de Segmentación (segmentation.process)
 *       - Aplica filtros complejos
 *       - Llama a POST /api/communications/segment
 *       - Genera lista de voluntarios para comunicación
 *
 * 3. ENDPOINTS A IMPLEMENTAR EN BLUE PRISM:
 *    - POST /api/blueprism/ingest - Recibe datos desde RPA
 *    - GET /api/blueprism/status - Estado de procesos RPA
 *    - POST /api/blueprism/trigger - Dispara procesos RPA manualmente
 */

import type { Volunteer } from "@/types/volunteer"

// 🔵 BLUE PRISM CONFIG
export const BLUEPRISM_CONFIG = {
  // Configurar estas URLs según tu instalación de Blue Prism
  RPA_API_URL: process.env.BLUEPRISM_API_URL || "http://localhost:8181/api/v1",
  RPA_API_KEY: process.env.BLUEPRISM_API_KEY || "YOUR_API_KEY",

  // Procesos de Blue Prism a invocar
  PROCESSES: {
    DATA_INGESTION: "teleton-data-ingestion",
    SMART_SEARCH: "teleton-smart-search",
    SEGMENTATION: "teleton-segmentation",
    COMMUNICATION: "teleton-communication",
  },
}

// 🔵 DATABASE CONFIG
export const DATABASE_CONFIG = {
  // Configurar string de conexión a la base de datos
  CONNECTION_STRING: process.env.DATABASE_URL || "postgresql://localhost:5432/teleton_crm",

  // Tablas de la base de datos
  TABLES: {
    VOLUNTEERS: "volunteers",
    CAMPAIGNS: "campaigns",
    PARTICIPATIONS: "participations",
    SKILLS: "skills",
    COMMUNICATIONS: "communications",
  },
}

// 🔵 BLUE PRISM INTEGRATION FUNCTIONS
export async function triggerBluePrismProcess(processName: string, parameters: Record<string, unknown>) {
  /**
   * Dispara un proceso de Blue Prism
   * Blue Prism debe exponer este endpoint REST API
   */
  try {
    const response = await fetch(`${BLUEPRISM_CONFIG.RPA_API_URL}/process/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLUEPRISM_CONFIG.RPA_API_KEY}`,
      },
      body: JSON.stringify({
        processName,
        parameters,
        async: true,
      }),
    })

    return await response.json()
  } catch (error) {
    console.error("[BLUE PRISM ERROR]", error)
    throw error
  }
}

export async function getBluePrismProcessStatus(processId: string) {
  /**
   * Consulta el estado de un proceso de Blue Prism en ejecución
   */
  try {
    const response = await fetch(`${BLUEPRISM_CONFIG.RPA_API_URL}/process/${processId}/status`, {
      headers: {
        Authorization: `Bearer ${BLUEPRISM_CONFIG.RPA_API_KEY}`,
      },
    })

    return await response.json()
  } catch (error) {
    console.error("[BLUE PRISM ERROR]", error)
    throw error
  }
}

// 🔵 DATABASE INTEGRATION FUNCTIONS
export async function executeDatabaseQuery(query: string, params: unknown[] = []) {
  /**
   * CONECTAR AQUÍ CON TU BASE DE DATOS
   * Ejemplo con PostgreSQL, MySQL, etc.
   *
   * Para conectar con la BD:
   * 1. Instalar el driver apropiado (pg, mysql2, etc.)
   * 2. Configurar DATABASE_URL en variables de entorno
   * 3. Implementar la lógica de conexión aquí
   */

  // TODO: Implementar conexión real a base de datos
  console.log("[DATABASE] Query:", query, "Params:", params)

  // Simulación - REEMPLAZAR con query real
  return []
}

// Funciones auxiliares para RPA
export const RPAHelpers = {
  // Valida datos antes de insertar
  validateVolunteerData: (data: Record<string, unknown>): boolean => {
    return !!(data.nombre && data.email && data.rut)
  },

  // Normaliza formato de datos
 // Normaliza formato de datos desde la API hacia Volunteer
normalizeVolunteerData: (data: Record<string, unknown>): Partial<Volunteer> => {
  const d = data as Record<string, string | undefined>;
  return {
    nombres: d.nombres?.trim(),
    primerApellido: d.primerAapellido?.trim(),
    segundoApellido: d.segundoApellido?.trim(),
    tipoDocumento: d.tipoDocumento?.trim(),
    numeroDocumento: d.numeroDocumento?.replace(/[^0-9kK-]/g, ""), // limpia RUT/DNI
    nacionalidad: d.nacionalidad?.trim(),
    fechaNacimiento: d.fechaNacimiento ? new Date(d.fechaNacimiento) : undefined,
    genero: d.genero?.trim(),
    telefono: d.telefono?.replace(/[^0-9+]/g, ""),
    email: d.email?.toLowerCase().trim(),
    region: d.region?.trim(),
    comuna: d.comuna?.trim(),
    instituto: d.instituto?.trim(),
    ocupacion: d.ocupacion?.trim(),
    estadoVoluntario: d.estadoVoluntario as "activo" | "inactivo" | "pendiente" | undefined,
    tipoVoluntariado: d.tipoVoluntariado?.split(",").map(v => v.trim()) ?? [],
    habilidades: d.habilidades?.split(",").map(v => v.trim()) ?? [],
    disponibilidad: d.disponibilidad?.trim(),
    campanasParticipadas: d.campanasParticipadas?.split(",").map(v => v.trim()) ?? [],
    capacitaciones: d.capacitaciones?.split(",").map(v => v.trim()) ?? [],
    fechaRegistro: d.fechaRegistro?.trim(),
    ultimaParticipacion: d.ultimaParticipacion?.trim(),
  };
},
  // Genera ID único
  generateVolunteerId: (): string => {
    return `VOL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
}
