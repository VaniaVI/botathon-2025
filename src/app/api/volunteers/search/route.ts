import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/api-integration";
import type { FilterOptions, Volunteer } from "@/types/volunteer";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const filters: FilterOptions = await request.json();
    console.log("[BLUE PRISM SEARCH] Filters:", filters);

    // Construir SQL dinámico con filtros
    let sql = `
      SELECT 
        nombres AS "Nombres",
        apellidop AS "ApellidoP",
        apellidom AS "ApellidoM",
        fechanacimiento AS "FechaNacimiento",
        sexo AS "Sexo",
        regionpostulante AS "RegionPostulante",
        comunapostulante AS "ComunaPostulante",
        estado AS "Estado",
        email AS "Email",
        telefono AS "Telefono",
        rut AS "Rut",
        tipo_voluntariado AS "TipoVoluntariado",
        campana AS "Campana",
        created_at,
        updated_at
      FROM volunteer
      WHERE 1=1
    `;

    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (filters.region) {
      sql += ` AND regionpostulante = $${paramIndex++}`;
      params.push(filters.region);
    }

if (filters.estadoVoluntario) {
  let estadoValue: number | undefined;

  if (filters.estadoVoluntario === "activo") estadoValue = 1;
  else if (filters.estadoVoluntario === "inactivo") estadoValue = 0;

  // Solo agregar a SQL y params si tenemos un valor válido
  if (estadoValue !== undefined) {
    sql += ` AND estado = $${paramIndex++}`;
    params.push(estadoValue);
  }
}

    if (filters.tipoVoluntariado) {
      sql += ` AND tipo_voluntariado = $${paramIndex++}`;
      params.push(filters.tipoVoluntariado);
    }

    if (filters.campana) {
      sql += ` AND campana = $${paramIndex++}`;
      params.push(filters.campana);
    }

    if (filters.habilidad) {
      // Si tienes tabla intermedia habilidades_voluntario, se puede hacer JOIN aquí
      // Para simplificar, se omite
    }

    if (filters.searchTerm) {
      sql += ` AND (
        LOWER(nombres) LIKE $${paramIndex} OR 
        LOWER(apellidop) LIKE $${paramIndex} OR 
        LOWER(email) LIKE $${paramIndex} OR 
        rut LIKE $${paramIndex}
      )`;
      params.push(`%${filters.searchTerm.toLowerCase()}%`);
      paramIndex++;
    }

    const volunteers: Volunteer[] = await query<Volunteer>(sql, params);

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      count: volunteers.length,
      data: volunteers,
      filters,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API ERROR]", error);
    return NextResponse.json({ success: false, error: "Error in search" }, { status: 500 });
  }
}
