// API para obtener estadísticas del dashboard

import { type NextRequest, NextResponse } from "next/server"
import { getMockVolunteers } from "@/lib/mock-data"
import type { DashboardStats } from "@/types/volunteer"

export async function GET(request: NextRequest) {
  try {
    // 🔵 REEMPLAZAR: Consultar estadísticas desde base de datos
    const volunteers = getMockVolunteers()

    // Calcular estadísticas
    const stats: DashboardStats = {
      totalVoluntarios: volunteers.length,
      voluntariosActivos: volunteers.filter((v) => v.estadoVoluntario === "activo").length,

      voluntariosPorRegion: Object.entries(
        volunteers.reduce(
          (acc, v) => {
            acc[v.region] = (acc[v.region] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      ).map(([region, count]) => ({ region, count })),

      voluntariosPorCampana: Object.entries(
        volunteers
          .flatMap((v) => v.campanasParticipadas)
          .reduce(
            (acc, c) => {
              acc[c] = (acc[c] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ),
      ).map(([campana, count]) => ({ campana, count })),

      voluntariosPorTipo: Object.entries(
        volunteers
          .flatMap((v) => v.tipoVoluntariado)
          .reduce(
            (acc, t) => {
              acc[t] = (acc[t] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ),
      ).map(([tipo, count]) => ({ tipo, count })),

      participacionMensual: [
        { mes: "Ene", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "Feb", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "Mar", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "Abr", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "May", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "Jun", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "Jul", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "Ago", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "Sep", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "Oct", participantes: Math.floor(Math.random() * 200) + 100 },
        { mes: "Nov", participantes: Math.floor(Math.random() * 200) + 300 },
        { mes: "Dic", participantes: Math.floor(Math.random() * 200) + 250 },
      ],
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("[API ERROR]", error)
    return NextResponse.json({ success: false, error: "Error fetching stats" }, { status: 500 })
  }
}
