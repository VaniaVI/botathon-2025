// 🔵 API para obtener estadísticas del dashboard usando BD real
import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/api-integration" // helper Neon/PostgreSQL
import type { DashboardStats, CountByKey, MonthlyParticipation } from "@/types/volunteer"

interface VolunteerDBRow {
  id: number
  nombres: string
  apellidop: string
  apellidom: string | null
  estado: number | null
  regionpostulante: string | null
  tipo_voluntariado: string | null
  campana: string | null
  created_at: string
}

export async function GET(request: NextRequest) {
  try {
    const volunteers = await query<VolunteerDBRow>(`
      SELECT 
        v.id, 
        v.nombres, 
        v.apellidop, 
        v.apellidom, 
        v.estado,
        r.nombre AS regionpostulante,
        t.tipo AS tipo_voluntariado,
        c.campana AS campana,
        v.created_at
      FROM volunteer v
      LEFT JOIN region r ON v.regionpostulante = r.id
      LEFT JOIN tipo_voluntariado t ON v.tipo_voluntariado = t.id
      LEFT JOIN programa_campana c ON v.campana = c.id
    `)

    console.log("Voluntarios obtenidos de la BD:", volunteers)

    const totalVoluntarios = volunteers.length
    const voluntariosActivos = volunteers.filter(v => v.estado === 1).length

    const voluntariosPorRegion: CountByKey[] = Object.entries(
      volunteers.reduce((acc, v) => {
        const key = v.regionpostulante || "Sin región"
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([key, count]) => ({ key, count: count as number }))

    const voluntariosPorCampana: CountByKey[] = Object.entries(
      volunteers.reduce((acc, v) => {
        const key = v.campana || "Sin campaña"
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([key, count]) => ({ key, count: count as number }))

    const voluntariosPorTipo: CountByKey[] = Object.entries(
      volunteers.reduce((acc, v) => {
        const key = v.tipo_voluntariado || "Sin tipo"
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([key, count]) => ({ key, count: count as number }))

    const participacionMensual: MonthlyParticipation[] = Array.from({ length: 12 }, (_, i) => {
      const mes = new Date(0, i).toLocaleString("es-CL", { month: "short" })
      const participantes = volunteers.filter(v => {
        if (!v.created_at) return false
        return new Date(v.created_at).getMonth() === i
      }).length
      return { mes, participantes }
    })

    const stats: DashboardStats = {
      totalVoluntarios,
      voluntariosActivos,
      voluntariosPorRegion,
      voluntariosPorCampana,
      voluntariosPorTipo,
      participacionMensual,
    }

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("[API ERROR]", error)
    return NextResponse.json({ success: false, error: "Error fetching stats" }, { status: 500 })
  }
}
