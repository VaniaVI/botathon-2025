"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, TrendingUp, MapPin } from "lucide-react"

interface StatsCardsProps {
  totalVoluntarios: number
  voluntariosActivos: number
  totalRegiones: number
  participacionActual: number
}

export function StatsCards({
  totalVoluntarios,
  voluntariosActivos,
  totalRegiones,
  participacionActual,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Voluntarios",
      value: totalVoluntarios.toLocaleString(),
      icon: Users,
      description: "Histórico registrado",
      color: "text-primary",
    },
    {
      title: "Voluntarios Activos",
      value: voluntariosActivos.toLocaleString(),
      icon: UserCheck,
      description: "Disponibles ahora",
      color: "text-green-600",
    },
    {
      title: "Regiones Cubiertas",
      value: totalRegiones.toString(),
      icon: MapPin,
      description: "Cobertura nacional",
      color: "text-blue-600",
    },
    {
      title: "Participación 2024",
      value: `${participacionActual.toLocaleString()}`,
      icon: TrendingUp,
      description: "Voluntarios activos",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="mt-2 text-3xl font-bold text-foreground">{stat.value}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`rounded-full bg-secondary p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
