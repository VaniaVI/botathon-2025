"use client"

import { useState, useEffect } from "react"
import { SearchFilters } from "@/components/search/search-filters"
import { SegmentationPanel } from "@/components/communications/segmentation-panel"
import { VolunteersTable } from "@/components/search/volunteers-table"
import type { FilterOptions, Volunteer } from "@/types/volunteer"
import { initializeMockData } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CommunicationsPage() {
  const [filters, setFilters] = useState<FilterOptions>({})
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    initializeMockData()
  }, [])

  const handleSearch = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/volunteers/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      })

      const result = await response.json()

      if (result.success) {
        setVolunteers(result.data)
        setTotalCount(result.count)
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
          <h1 className="mt-4 text-3xl font-bold text-foreground">Comunicaciones Segmentadas</h1>
          <p className="mt-1 text-muted-foreground">
            Segmenta voluntarios y prepara comunicaciones masivas con Blue Prism
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SearchFilters
              filters={filters}
              onFilterChange={setFilters}
              onSearch={handleSearch}
              onClear={handleClear}
              loading={loading}
            />

            {volunteers.length > 0 && <VolunteersTable volunteers={volunteers} totalCount={totalCount} />}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <SegmentationPanel filters={filters} selectedCount={totalCount} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
