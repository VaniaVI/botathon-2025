// 🔵 BLUE PRISM INTEGRATION POINT #4: Smart Search
// Motor de búsqueda inteligente - Blue Prism procesa las búsquedas complejas

import { type NextRequest, NextResponse } from "next/server"
import { getMockVolunteers } from "@/lib/mock-data"
import type { FilterOptions } from "@/types/volunteer"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const filters: FilterOptions = await request.json()

    console.log("[BLUE PRISM SEARCH] Filters:", filters)

    // 🔵 REEMPLAZAR: Blue Prism debe ejecutar búsqueda optimizada en BD
    // Debe completar en menos de 10 segundos (requisito RNF-08)

    let volunteers = getMockVolunteers()

    // Aplicar filtros
    if (filters.region) {
      volunteers = volunteers.filter((v) => v.region === filters.region)
    }

    if (filters.instituto) {
      volunteers = volunteers.filter((v) => v.instituto === filters.instituto)
    }

    if (filters.estadoVoluntario) {
      volunteers = volunteers.filter((v) => v.estadoVoluntario === filters.estadoVoluntario)
    }

if (filters.tipoVoluntariado) {
  const tiposVoluntariado = Array.isArray(filters.tipoVoluntariado)
    ? filters.tipoVoluntariado
    : [filters.tipoVoluntariado];

  volunteers = volunteers.filter((v) =>
    tiposVoluntariado.every((t) => v.tipoVoluntariado.includes(t))
  );
}

    if (filters.campana) {
      const campanasParticipadas = Array.isArray(filters.campana) ? filters.campana : [filters.campana]
      volunteers = volunteers.filter((v) => 
        campanasParticipadas.every((h) => v.campanasParticipadas.includes(h))
    );
    }

    if (filters.habilidad) {
    const habilidades = Array.isArray(filters.habilidad) ? filters.habilidad : [filters.habilidad];
    volunteers = volunteers.filter((v) =>
      habilidades.every((h) => v.habilidades.includes(h))
    );
}
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      volunteers = volunteers.filter(
        (v) =>
          v.nombres.toLowerCase().includes(term) ||
          v.primerApellido.toLowerCase().includes(term) ||
          v.email.toLowerCase().includes(term) ||
          v.numeroDocumento.includes(term),
      )
    }

    const duration = Date.now() - startTime

    return NextResponse.json({
      success: true,
      count: volunteers.length,
      data: volunteers,
      filters,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[API ERROR]", error)
    return NextResponse.json({ success: false, error: "Error in search" }, { status: 500 })
  }
}

