import type { ReactNode } from "react"
import { Navbar } from "@/components/navbar"

interface SiteLayoutProps {
  children: ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; 2025 deLance. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Términos
            </a>
            <a href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Privacidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
