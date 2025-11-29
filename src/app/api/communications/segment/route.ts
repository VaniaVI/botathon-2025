// 🔵 SEGMENTACIÓN DE VOLUNTARIOS SOLO CON BD
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { filters, communicationType, message } = await request.json()

    console.log("[COMMUNICATION SEGMENTATION] Starting process")
    console.log("Filters:", filters)
    console.log("Type:", communicationType)
    console.log("Message:", message)

    // 🔹 Llamada a tu endpoint real de búsqueda de voluntarios
    const searchResponse = await fetch(`${request.nextUrl.origin}/api/volunteers/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    })

    const searchResult = await searchResponse.json()

    // 🔹 Retorna resultado con preview y status
    return NextResponse.json({
      success: true,
      segmentation: {
        totalSelected: searchResult.count,
        filters,
        communicationType,
        status: "ready_to_send",
        timestamp: new Date().toISOString(),
      },
      volunteers: searchResult.volunteers.slice(0, 100), // Primeros 100 para preview
      message: `Segmentación completada. ${searchResult.count} voluntarios seleccionados para comunicación.`,
    })
  } catch (error) {
    console.error("[API ERROR]", error)
    return NextResponse.json({ success: false, error: "Error in segmentation" }, { status: 500 })
  }
}
