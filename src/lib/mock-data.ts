// Datos de ejemplo para demostración del MVP
// En producción, estos datos vendrían de la base de datos vía Blue Prism

import type { Volunteer } from "@/types/volunteer"

export const REGIONES_CHILE = [
  "Región Metropolitana",
  "Región de Valparaíso",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Lagos",
  "Región del Maule",
  "Región de O'Higgins",
  "Región de Coquimbo",
  "Región de Antofagasta",
  "Región de Tarapacá",
  "Región de Arica y Parinacota",
  "Región de Atacama",
  "Región de Aysén",
  "Región de Magallanes",
  "Región de Los Ríos",
  "Región de Ñuble",
]

export const INSTITUTOS_DUOC = [
  "Duoc UC Sede Padre Alonso de Ovalle",
  "Duoc UC Sede Plaza Vespucio",
  "Duoc UC Sede San Bernardo",
  "Duoc UC Sede Maipú",
  "Duoc UC Sede Viña del Mar",
  "Duoc UC Sede Valparaíso",
  "Duoc UC Sede Concepción",
  "Duoc UC Sede Puerto Montt",
  "Duoc UC Sede Antonio Varas",
  "Duoc UC Sede Plaza Norte",
  "Duoc UC Sede Puente Alto",
  "Otro",
]

export const TIPOS_VOLUNTARIADO = [
  "Animación y entretenimiento",
  "Atención al público",
  "Logística y coordinación",
  "Primeros auxilios",
  "Comunicaciones y redes sociales",
  "Apoyo técnico",
  "Recaudación",
  "Música y artes escénicas",
  "Pedagogía y educación",
  "Traducción (lenguaje de señas)",
  "Fotografía y video",
  "Cocina y alimentación",
]

export const HABILIDADES = [
  "Primeros auxilios",
  "Lenguaje de señas",
  "Música",
  "Teatro",
  "Danza",
  "Comunicación",
  "Liderazgo",
  "Trabajo en equipo",
  "Pedagogía",
  "Diseño gráfico",
  "Fotografía",
  "Video",
  "Redes sociales",
  "Cocina",
  "Logística",
  "Conducción",
]

export const CAMPANAS = [
  "Teletón 2024",
  "Teletón 2023",
  "Teletón 2022",
  "Teletón 2021",
  "Teletón 2020",
  "Campaña Verano 2024",
  "Campaña Navidad 2023",
  "Día del Voluntariado 2024",
]

// Genera datos mock de voluntarios
export function generateMockVolunteers(count = 500): Volunteer[] {
  const volunteers: Volunteer[] = []

  for (let i = 0; i < count; i++) {
    const firstName = ["Juan", "María", "Pedro", "Ana", "Carlos", "Sofía", "Diego", "Valentina", "Mateo", "Isabella"][
      Math.floor(Math.random() * 10)
    ]
    const lastName = [
      "González",
      "Rodríguez",
      "Pérez",
      "López",
      "Martínez",
      "García",
      "Fernández",
      "Silva",
      "Muñoz",
      "Rojas",
    ][Math.floor(Math.random() * 10)]

    volunteers.push({
      id: `VOL-${String(i + 1).padStart(6, "0")}`,
      nombre: firstName,
      apellido: lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      telefono: `+569${Math.floor(10000000 + Math.random() * 90000000)}`,
      rut: `${Math.floor(10000000 + Math.random() * 15000000)}-${Math.floor(Math.random() * 10)}`,
      region: REGIONES_CHILE[Math.floor(Math.random() * REGIONES_CHILE.length)],
      comuna: `Comuna ${Math.floor(Math.random() * 50) + 1}`,
      instituto: INSTITUTOS_DUOC[Math.floor(Math.random() * INSTITUTOS_DUOC.length)],
      ocupacion: ["Estudiante", "Profesional", "Técnico", "Independiente"][Math.floor(Math.random() * 4)],
      estadoVoluntario: ["activo", "activo", "activo", "inactivo", "pendiente"][Math.floor(Math.random() * 5)] as any,
      tipoVoluntariado: [
        TIPOS_VOLUNTARIADO[Math.floor(Math.random() * TIPOS_VOLUNTARIADO.length)],
        ...(Math.random() > 0.5 ? [TIPOS_VOLUNTARIADO[Math.floor(Math.random() * TIPOS_VOLUNTARIADO.length)]] : []),
      ],
      habilidades: [
        HABILIDADES[Math.floor(Math.random() * HABILIDADES.length)],
        HABILIDADES[Math.floor(Math.random() * HABILIDADES.length)],
        ...(Math.random() > 0.7 ? [HABILIDADES[Math.floor(Math.random() * HABILIDADES.length)]] : []),
      ].filter((v, i, a) => a.indexOf(v) === i),
      disponibilidad: ["Fines de semana", "Entre semana", "Flexible", "Solo eventos especiales"][
        Math.floor(Math.random() * 4)
      ],
      campanasParticipadas: CAMPANAS.slice(0, Math.floor(Math.random() * 4) + 1),
      capacitaciones: ["Primeros Auxilios Básicos", "Atención al Público", "Trabajo en Equipo"].slice(
        0,
        Math.floor(Math.random() * 3),
      ),
      fechaRegistro: new Date(
        2020 + Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      ).toISOString(),
      ultimaParticipacion: new Date(
        2023 + Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      ).toISOString(),
    })
  }

  return volunteers
}

// Simula datos en localStorage
export function initializeMockData() {
  if (typeof window !== "undefined") {
    const existing = localStorage.getItem("teleton_volunteers")
    if (!existing) {
      const volunteers = generateMockVolunteers(500)
      localStorage.setItem("teleton_volunteers", JSON.stringify(volunteers))
    }
  }
}

export function getMockVolunteers(): Volunteer[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("teleton_volunteers")
    if (data) {
      return JSON.parse(data)
    }
  }
  return generateMockVolunteers(500)
}
