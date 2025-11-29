"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import type { FilterOptions } from "@/types/volunteer"

interface SearchFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  onSearch: () => void
  onClear: () => void
  loading?: boolean

  // Nuevos props que reemplazan mock-data
  regiones?: string[]
  tiposVoluntariado?: string[]
  habilidades?: string[]
  campanas?: string[]
}

export function SearchFilters({
  filters,
  onFilterChange,
  onSearch,
  onClear,  
  loading,
  regiones = [],
  tiposVoluntariado = [],
  habilidades = [],
  campanas = []
}: SearchFiltersProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Búsqueda Inteligente de Voluntarios</CardTitle>
        <CardDescription className="text-muted-foreground">
          Utiliza filtros avanzados para encontrar voluntarios específicos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Búsqueda general */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-foreground">Búsqueda General</Label>
          <Input
            id="search"
            placeholder="Nombre, email, RUT..."
            value={filters.searchTerm || ""}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            className="border-border bg-background text-foreground"
          />
        </div>

        {/* Filtros principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {/* Región */}
          <div className="space-y-2">
            <Label className="text-foreground">Región</Label>
            <Select
              value={filters.region || "Todas"}
              onValueChange={(value) => onFilterChange({ ...filters, region: value })}
            >
              <SelectTrigger className="border-border bg-background text-foreground">
                <SelectValue placeholder="Todas las regiones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                {(regiones || []).map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
<Select
  value={filters.estadoVoluntario?.toString() || ""}
  onValueChange={(value) =>
    onFilterChange({
      ...filters,
      estadoVoluntario: value ? Number(value) as 1|2|3 : undefined,
    })
  }
>
  <SelectItem value="1">Activo</SelectItem>
  <SelectItem value="2">Inactivo</SelectItem>
  <SelectItem value="3">Pendiente</SelectItem>
</Select>




          {/* Tipo de Voluntariado */}
          <div className="space-y-2">
            <Label className="text-foreground">Tipo de Voluntariado</Label>
            <Select
              value={filters.tipoVoluntariado || "Todos"}
              onValueChange={(value) => onFilterChange({ ...filters, tipoVoluntariado: value })}
            >
              <SelectTrigger className="border-border bg-background text-foreground">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {(tiposVoluntariado || []).map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Habilidades */}
          <div className="space-y-2">
            <Label className="text-foreground">Habilidad</Label>
            <Select
              value={filters.habilidad || "Todas"}
              onValueChange={(value) => onFilterChange({ ...filters, habilidad: value })}
            >
              <SelectTrigger className="border-border bg-background text-foreground">
                <SelectValue placeholder="Todas las habilidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                {(habilidades || []).map((habilidad) => (
                  <SelectItem key={habilidad} value={habilidad}>{habilidad}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campañas */}
          <div className="space-y-2">
            <Label className="text-foreground">Campaña</Label>
            <Select
              value={filters.campana || "Todas"}
              onValueChange={(value) => onFilterChange({ ...filters, campana: value })}
            >
              <SelectTrigger className="border-border bg-background text-foreground">
                <SelectValue placeholder="Todas las campañas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas</SelectItem>
                {(campanas || []).map((campana) => (
                  <SelectItem key={campana} value={campana}>{campana}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* Botones */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onSearch}
            disabled={loading}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Search className="mr-2 h-4 w-4" />
            {loading ? "Buscando..." : "Buscar Voluntarios"}
          </Button>

          <Button
            onClick={onClear}
            variant="outline"
            className="border-border text-foreground hover:bg-secondary bg-transparent"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
