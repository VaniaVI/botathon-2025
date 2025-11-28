export interface Volunteer {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  rut: string
  region: string
  comuna: string
  instituto: string
  ocupacion: string
  estadoVoluntario: "activo" | "inactivo" | "pendiente"
  tipoVoluntariado: string[]
  habilidades: string[]
  disponibilidad: string
  campanasParticipadas: string[]
  capacitaciones: string[]
  fechaRegistro: string
  ultimaParticipacion: string
}

export interface DashboardStats {
  totalVoluntarios: number
  voluntariosActivos: number
  voluntariosPorRegion: { region: string; count: number }[]
  voluntariosPorCampana: { campana: string; count: number }[]
  voluntariosPorTipo: { tipo: string; count: number }[]
  participacionMensual: { mes: string; participantes: number }[]
}

export interface FilterOptions {
  region?: string
  instituto?: string
  estadoVoluntario?: string
  tipoVoluntariado?: string
  campana?: string
  habilidad?: string
  searchTerm?: string
}

export interface SegmentationResult {
  volunteers: Volunteer[]
  count: number
  filters: FilterOptions
  timestamp: string
}
