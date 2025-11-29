export interface Volunteer {
  id: string
  nombres: string
  primerApellido: string
  segundoApellido: string
  tipoDocumento: string
  numeroDocumento: string
  nacionalidad: string
  fechaNacimiento: Date
  genero: string
  telefono: string
  email: string
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
  region?: string;
  instituto?: string;
  estadoVoluntario?: "activo" | "inactivo" | "pendiente";
  tipoVoluntariado?: string;  
  campana?: string;           
  habilidad?: string;         
  searchTerm?: string;
}

export interface SegmentationResult {
  volunteers: Volunteer[]
  count: number
  filters: FilterOptions
  timestamp: string
}
