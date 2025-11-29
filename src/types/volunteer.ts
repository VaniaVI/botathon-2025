export interface Volunteer {
  id: number
  nombres: string
  apellidop: string
  apellidom: string | null
  fechanacimiento: string | null   // viene como "1992-09-26"
  sexo: number | null              // 0 = masculino, 1 = femenino
  regionpostulante: number | null
  comunapostulante: string | null
  estado: number | null            // relación con volunteer_state
  activo: number | null            // 1 = activo
  email: string | null
  telefono: string | null
  rut: string | null
  campana: number | null           // FK a tabla campaña
  tipo_voluntariado: number | null // FK a tipo_voluntario
  habilidad: number | null         // FK a habilidad
  created_at: string
  updated_at: string
}

// ======================================================
//  Interfaces y Tipos para Voluntarios + Dashboard + Filtros
//  Este archivo define todos los tipos utilizados
//  por el motor de búsqueda, dashboard y segmentación.
// ======================================================






// 🔹 Tipo principal del voluntario
export interface Volunteer {
  Nombres: string;
  ApellidoP: string;
  ApellidoM: string;
  FechaNacimiento: Date | null;
  Sexo: string;
  RegionPostulante: number | null;
  ComunaPostulante: string;
  Estado: number | null;
  Email: string | null;
  Telefono: string | null;
  Rut: string | null;
}

// ======================================================
// Tipos auxiliares para evitar repetición de código
// ======================================================

export interface CountByKey {
  // Para: región, campaña, tipo, etc.
  key: string
  count: number;
}

export interface MonthlyParticipation {
  mes: string;
  participantes: number;
}

// ======================================================
// Dashboard principal
// ======================================================

export interface DashboardStats {
  totalVoluntarios: number;
  voluntariosActivos: number;
  voluntariosPorRegion: CountByKey[];
  voluntariosPorCampana: CountByKey[];
  voluntariosPorTipo: CountByKey[];
  participacionMensual: MonthlyParticipation[];
}
// ======================================================
// Opciones de filtrado para Smart Search
// ======================================================

export interface FilterOptions {
  region?: string;
  estadoVoluntario?: "activo" | "inactivo" | "pendiente";
  tipoVoluntariado?: string;
  campana?: string;
  habilidad?: string;
  searchTerm?: string;
}

// ======================================================
// Resultado de segmentación
// ======================================================

export interface SegmentationResult {
  volunteers: Volunteer[];
  count: number;
  filters: FilterOptions;
  timestamp: string;
}
