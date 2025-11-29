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

    // Región: el filtro trae el NOMBRE (ej: "Metropolitana de Santiago"),
    // pero en volunteer.RegionPostulante se guarda el ID (FK a region.id)
    if (filters.region && filters.region !== "Todas") {
      sql += " AND RegionPostulante IN (SELECT id FROM region WHERE nombre = ?)";
      params.push(filters.region);
    }

    // Estado: el filtro trae "activo" | "inactivo" | "pendiente"
    // y en volunteer.Estado se guarda 1 | 2 | 3 (FK a volunteer_state.id)
    if (filters.estadoVoluntario && filters.estadoVoluntario !== "Todos") {
      let estadoId: number | null = null;
      switch (filters.estadoVoluntario) {
        case "activo":
          estadoId = 1;
          break;
        case "inactivo":
          estadoId = 2;
          break;
        case "pendiente":
          estadoId = 3;
          break;
      }

      if (estadoId !== null) {
        sql += " AND Estado = ?";
        params.push(estadoId);
      }
    }

    // Tipo de voluntariado: filtro trae el nombre (tipo_voluntariado.tipo)
    // y volunteer.Tipo_voluntariado guarda el ID
    if (filters.tipoVoluntariado && filters.tipoVoluntariado !== "Todos") {
      sql += " AND Tipo_voluntariado IN (SELECT id FROM tipo_voluntariado WHERE tipo = ?)";
      params.push(filters.tipoVoluntariado);
    }

    // Habilidad: filtro trae el nombre (habilidad.nombre)
    // y volunteer.Habilidad guarda el ID
    if (filters.habilidad && filters.habilidad !== "Todas") {
      sql += " AND Habilidad IN (SELECT id FROM habilidad WHERE nombre = ?)";
      params.push(filters.habilidad);
    }

    // Campaña: filtro trae el nombre (programa_campana.campana)
    // y volunteer.Campana guarda el ID
    if (filters.campana && filters.campana !== "Todas") {
      sql += " AND Campana IN (SELECT id FROM programa_campana WHERE campana = ?)";
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
