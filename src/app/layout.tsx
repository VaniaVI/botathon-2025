import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "sonner"
import Link from "next/link"
import { LayoutDashboard, Search, Send } from "lucide-react"
import { Suspense } from "react"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CRM Voluntarios Teletón",
  description: "Sistema de gestión de voluntarios con Blue Prism RPA - MVP Botathon 2025",
  icons: {
    icon: [
      {
        url: "/Logo_Teleton.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/Logo_Teleton.svg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/Logo_Teleton.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="fixed left-0 top-0 h-full w-16 border-r border-border bg-card flex flex-col items-center py-4 gap-4 z-50">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              title="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
            </Link>
            <Link
              href="/search"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Búsqueda"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/communications"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              title="Comunicaciones"
            >
              <Send className="h-5 w-5" />
            </Link>
          </div>

          <div className="pl-16">{children}</div>
        </Suspense>

        {/* Toaster de Sonner */}
        <Toaster richColors closeButton />

        <Analytics />
      </body>
    </html>
  )
}
