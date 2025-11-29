import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/api-integration";
import type { Volunteer } from "@/types/volunteer";

export async function GET(request: NextRequest) {
  try {
    const sql = `
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
        created_at,
        updated_at
      FROM volunteer;
    `;

    const volunteers: Volunteer[] = await query<Volunteer>(sql);

    return NextResponse.json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    console.error("[API ERROR]", error);
    return NextResponse.json({ success: false, error: "Error fetching volunteers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Partial<Volunteer>;

    if (!body.Nombres || !body.ApellidoP || !body.ApellidoM) {
      return NextResponse.json({ success: false, error: "Missing volunteer identifiers" }, { status: 400 });
    }

    const sql = `
      UPDATE volunteer
      SET email = $1, telefono = $2, rut = $3
      WHERE nombres = $4 AND apellidop = $5 AND apellidom = $6
      RETURNING 
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
        created_at,
        updated_at;
    `;

    const params = [
      body.Email || null,
      body.Telefono || null,
      body.Rut || null,
      body.Nombres,
      body.ApellidoP,
      body.ApellidoM,
    ];

    const result = await query<Volunteer>(sql, params);

    return NextResponse.json({
      success: true,
      message: "Volunteer updated successfully",
      data: result[0] || null,
    });
  } catch (error) {
    console.error("[API ERROR]", error);
    return NextResponse.json({ success: false, error: "Error updating volunteer" }, { status: 500 });
  }
}
