import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/api-integration";
import type { Volunteer, FilterOptions } from "@/types/volunteer";

export async function POST(request: NextRequest) {
  try {
    const filters = (await request.json()) as FilterOptions;

    let sql = `
      SELECT 
        nombres AS Nombres,
        apellidop AS ApellidoP,
        apellidom AS ApellidoM,
        fechanacimiento AS FechaNacimiento,
        sexo AS Sexo,
        regionpostulante AS RegionPostulante,
        comunapostulante AS ComunaPostulante,
        estado AS Estado,
        email AS Email,
        telefono AS Telefono,
        rut AS Rut,
        tipo_voluntariado AS TipoVoluntariado,
        campana AS Campana,
        created_at,
        updated_at
      FROM volunteer
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filters.region && filters.region !== "Todas") {
      sql += " AND RegionPostulante = ?";
      params.push(filters.region);
    }

    if (filters.estadoVoluntario && filters.estadoVoluntario !== "Todos") {
      sql += " AND Estado = ?";
      params.push(filters.estadoVoluntario);
    }

    if (filters.tipoVoluntariado && filters.tipoVoluntariado !== "Todos") {
      sql += " AND Tipo_voluntariado = ?";
      params.push(filters.tipoVoluntariado);
    }

    if (filters.habilidad && filters.habilidad !== "Todas") {
      sql += " AND Habilidad = ?";
      params.push(filters.habilidad);
    }

    if (filters.campana && filters.campana !== "Todas") {
      sql += " AND Campana = ?";
      params.push(filters.campana);
    }

    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      sql += " AND (nombres LIKE ? OR apellidop LIKE ? OR apellidom LIKE ? OR email LIKE ? OR rut LIKE ?)";
      const term = `%${filters.searchTerm.trim()}%`;
      params.push(term, term, term, term, term);
    }

    const volunteers: Volunteer[] = await query<Volunteer>(sql, params);

    return NextResponse.json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    console.error("[DATABASE ERROR]", error);
    return NextResponse.json({ success: false, error: "Error searching volunteers" }, { status: 500 });
  }
}
