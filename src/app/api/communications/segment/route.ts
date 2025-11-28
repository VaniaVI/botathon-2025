// 🔵 BLUE PRISM INTEGRATION POINT #5: Communication Segmentation
// Blue Prism usa este endpoint para segmentar voluntarios y preparar comunicaciones

import { type NextRequest, NextResponse } from "next/server"
import { triggerBluePrismProcess, BLUEPRISM_CONFIG } from "@/lib/api-integration"

export async function POST(request: NextRequest) {
  try {
    const { filters, communicationType, message } = await request.json()

    console.log("[COMMUNICATION SEGMENTATION] Starting process")
    console.log("Filters:", filters)
    console.log("Type:", communicationType)

    // 🔵 BLUE PRISM: Dispara proceso de segmentación y comunicación
    // Blue Prism debe:
    // 1. Aplicar filtros para segmentar voluntarios
    // 2. Generar lista de destinatarios
    // 3. Simular preparación de comunicación masiva (email/SMS)

    // Simula llamada a Blue Prism
    const rpaResult = await triggerBluePrismProcess(BLUEPRISM_CONFIG.PROCESSES.SEGMENTATION, {
      filters,
      communicationType,
      message,
    }).catch(() => ({
      processId: `BP-${Date.now()}`,
      status: "simulated",
      message: "Blue Prism process simulation (connect real RPA)",
    }))

    // Obtiene voluntarios segmentados (desde API de búsqueda)
    const searchResponse = await fetch(`${request.nextUrl.origin}/api/volunteers/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    })

    const searchResult = await searchResponse.json()

    return NextResponse.json({
      success: true,
      segmentation: {
        totalSelected: searchResult.count,
        filters,
        communicationType,
        status: "ready_to_send",
        blueprismProcess: rpaResult,
        timestamp: new Date().toISOString(),
      },
      volunteers: searchResult.data.slice(0, 100), // Primeros 100 para preview
      message: `Segmentación completada. ${searchResult.count} voluntarios seleccionados para comunicación.`,
    })
  } catch (error) {
    console.error("[API ERROR]", error)
    return NextResponse.json({ success: false, error: "Error in segmentation" }, { status: 500 })
  }
}
