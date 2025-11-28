"use client"

import { useState, useEffect } from "react"
import { SearchFilters } from "@/components/search/search-filters"
import { VolunteersTable } from "@/components/search/volunteers-table"
import type { FilterOptions, Volunteer } from "@/types/volunteer"
import { initializeMockData } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const [filters, setFilters] = useState<FilterOptions>({})
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchDuration, setSearchDuration] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const handleSearch = async () => {
    setLoading(true)

    try {
      // 🔵 BLUE PRISM: Ejecuta búsqueda inteligente
      const response = await fetch("/api/volunteers/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      })

      const result = await response.json()

      if (result.success) {
        setVolunteers(result.data)
        setTotalCount(result.count)
        setSearchDuration(result.duration)
      }
    } catch (error) {
      console.error("[SEARCH ERROR]", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFilters({})
    setVolunteers([])
    setTotalCount(0)
    setSearchDuration("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al Dashboard
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-foreground">Búsqueda de Voluntarios</h1>
          <p className="mt-1 text-muted-foreground">Motor de búsqueda inteligente con Blue Prism RPA</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            onSearch={handleSearch}
            onClear={handleClear}
            loading={loading}
          />

          {(volunteers.length > 0 || loading) && (
            <VolunteersTable volunteers={volunteers} totalCount={totalCount} searchDuration={searchDuration} />
          )}
        </div>
      </main>
    </div>
  )
}
