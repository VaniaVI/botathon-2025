import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/api-integration";
import type { Volunteer } from "@/types/volunteer";

export async function POST(request: NextRequest) {
  try {
    const { volunteers } = await request.json();

    if (!Array.isArray(volunteers)) {
      return NextResponse.json({ success: false, error: "Invalid data format" }, { status: 400 });
    }

    // 🔹 Filtrar y normalizar datos válidos
    const validVolunteers: Volunteer[] = volunteers.filter(
      (v) => v.nombres && v.apellidop && v.tipo_voluntariado && v.regionpostulante
    );

    if (validVolunteers.length === 0) {
      return NextResponse.json({
        success: false,
        inserted: 0,
        rejected: volunteers.length,
        message: "No valid volunteers to insert",
      });
    }

    // 🔹 Inserción masiva en MySQL
    for (const v of validVolunteers) {
      const sql = `
        INSERT INTO volunteer 
          (nombres, apellidop, apellidom, estado, regionpostulante, tipo_voluntariado, campana, email, telefono, rut, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
          nombres = VALUES(nombres),
          apellidop = VALUES(apellidop),
          apellidom = VALUES(apellidom),
          estado = VALUES(estado),
          regionpostulante = VALUES(regionpostulante),
          tipo_voluntariado = VALUES(tipo_voluntariado),
          campana = VALUES(campana),
          email = VALUES(email),
          telefono = VALUES(telefono),
          updated_at = NOW()
      `;

      const params = [
        v.nombres,
        v.apellidop,
        v.apellidom || null,
        v.estado || 1,
        v.regionpostulante,
        v.tipo_voluntariado,
        v.campana || null,
        v.email || null,
        v.telefono || null,
        v.rut || null,
      ];

      await query(sql, params);
    }

    return NextResponse.json({
      success: true,
      inserted: validVolunteers.length,
      rejected: volunteers.length - validVolunteers.length,
      message: `Successfully inserted ${validVolunteers.length} volunteers`,
    });
  } catch (error) {
    console.error("[API ERROR]", error);
    return NextResponse.json({ success: false, error: "Error in bulk insert" }, { status: 500 });
  }
}
