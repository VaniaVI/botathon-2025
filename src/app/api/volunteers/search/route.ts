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
        habilidad AS Habilidad,
        created_at,
        updated_at
      FROM volunteer
      WHERE 1=1
    `;

    const params: any[] = [];

    // Filtro: Región
    if (filters.region) {
      sql += " AND regionpostulante = ?";
      params.push(filters.region);
    }

    // Filtro: Estado (1=Activo, 2=Inactivo, 3=Pendiente)
    if (filters.estadoVoluntario) {
      sql += " AND estado = ?";
      params.push(filters.estadoVoluntario);
    }

    // Filtro: Tipo de voluntariado
    if (filters.tipoVoluntariado) {
      sql += " AND tipo_voluntariado = ?";
      params.push(filters.tipoVoluntariado);
    }

    // Filtro: Habilidad
    if (filters.habilidad) {
      sql += " AND habilidad = ?";
      params.push(filters.habilidad);
    }

    // Filtro: Campaña
    if (filters.campana) {
      sql += " AND campana = ?";
      params.push(filters.campana);
    }

    // Filtro: Búsqueda por nombre, email o RUT
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
    return NextResponse.json(
      { success: false, error: "Error searching volunteers" },
      { status: 500 }
    );
  }
}
