"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Volunteer } from "@/types/volunteer"
import { Mail, Phone, MapPin } from "lucide-react"

interface VolunteersTableProps {
  volunteers: Volunteer[]
  totalCount: number
  searchDuration?: string
}

export function VolunteersTable({ volunteers, totalCount, searchDuration }: VolunteersTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactivo":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Resultados de Búsqueda</CardTitle>
            <CardDescription className="text-muted-foreground">
              {totalCount} voluntarios encontrados
              {searchDuration && ` en ${searchDuration}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {volunteers.slice(0, 20).map((volunteer) => (
            <div
              key={volunteer.id}
              className="rounded-lg border border-border bg-card p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">
                      {volunteer.nombre} {volunteer.apellido}
                    </h3>
                    <Badge className={getStatusColor(volunteer.estadoVoluntario)}>{volunteer.estadoVoluntario}</Badge>
                  </div>

                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{volunteer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{volunteer.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{volunteer.region}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {volunteer.tipoVoluntariado.slice(0, 2).map((tipo) => (
                      <Badge key={tipo} variant="outline" className="text-xs">
                        {tipo}
                      </Badge>
                    ))}
                    {volunteer.habilidades.slice(0, 3).map((habilidad) => (
                      <Badge key={habilidad} variant="secondary" className="text-xs">
                        {habilidad}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

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
