"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Volunteer } from "@/types/volunteer"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"

interface VolunteersTableProps {
  volunteers: Volunteer[]
  totalCount: number
  searchDuration?: string
}

export function VolunteersTable({ volunteers, totalCount, searchDuration }: VolunteersTableProps) {
  const getStatusLabel = (estado: number | null) => {
    switch (estado) {
      case 1:
        return "Activo"
      case 2:
        return "Inactivo"
      case 3:
        return "Pendiente"
      default:
        return "Sin estado"
    }
  }

  const getStatusColor = (estado: number | null) => {
    switch (estado) {
      case 1:
        return "bg-green-100 text-green-800 border-green-200"
      case 2:
        return "bg-red-100 text-red-800 border-red-200"
      case 3:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Resultados de Búsqueda</CardTitle>
        <CardDescription className="text-muted-foreground">
          {totalCount} voluntarios encontrados
          {searchDuration && ` en ${searchDuration}`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {volunteers.map((v, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  
                  {/* Nombre + Estado */}
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">
                      {v.Nombres} {v.ApellidoP} {v.ApellidoM}
                    </h3>
                    <Badge className={getStatusColor(v.Estado)}>
                      {getStatusLabel(v.Estado)}
                    </Badge>
                  </div>

                  {/* Info básica */}
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2 lg:grid-cols-3">
                    {v.Email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{v.Email}</span>
                      </div>
                    )}

                    {v.Telefono && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{v.Telefono}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>
                        Región {v.RegionPostulante} — {v.ComunaPostulante}
                      </span>
                    </div>

                    {v.FechaNacimiento && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(v.FechaNacimiento).toLocaleDateString("es-CL")}</span>
                      </div>
                    )}

                    {v.Rut && (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">RUT:</span>
                        <span>{v.Rut}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Cuando no hay datos */}
          {volunteers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No se encontraron voluntarios con los filtros aplicados
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
