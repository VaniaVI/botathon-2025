"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { REGIONES_CHILE, INSTITUTOS_DUOC, TIPOS_VOLUNTARIADO, HABILIDADES, CAMPANAS } from "@/lib/mock-data"
import type { FilterOptions } from "@/types/volunteer"

interface SearchFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  onSearch: () => void
  onClear: () => void
  loading?: boolean
}

export function SearchFilters({ filters, onFilterChange, onSearch, onClear, loading }: SearchFiltersProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Búsqueda Inteligente de Voluntarios</CardTitle>
        <CardDescription className="text-muted-foreground">
          Utiliza filtros avanzados para encontrar voluntarios específicos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Búsqueda por texto */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-foreground">
            Búsqueda General
          </Label>
          <Input
            id="search"
            placeholder="Nombre, email, RUT..."
            value={filters.searchTerm || ""}
            onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
            className="border-border bg-background text-foreground"
          />
        </div>

        {/* Filtros por selección */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                {REGIONES_CHILE.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Estado</Label>
            <Select
              value={filters.estadoVoluntario || "Todos"}
              onValueChange={(value) =>
                onFilterChange({
                  ...filters,
                  estadoVoluntario:
                    value === "Todos"
                      ? undefined
                      : (value as "activo" | "inactivo" | "pendiente"),
                })
              }
            >
              <SelectTrigger className="border-border bg-background text-foreground">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>


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
                {TIPOS_VOLUNTARIADO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                {HABILIDADES.map((habilidad) => (
                  <SelectItem key={habilidad} value={habilidad}>
                    {habilidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
                {CAMPANAS.map((campana) => (
                  <SelectItem key={campana} value={campana}>
                    {campana}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botones de acción */}
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
