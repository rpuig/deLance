"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletButton } from "@/components/wallet-button"
import { useWallet } from "@/components/wallet-provider"
import { Home, User, Briefcase, Menu, X, Search, FileText, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"

export function Navbar() {
  const pathname = usePathname()
  const { connected, disconnect } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState<"freelancer" | "client" | null>(null)

  // Determinar el rol del usuario basado en la ruta
  useEffect(() => {
    if (pathname.includes("/freelancer")) {
      setUserRole("freelancer")
    } else if (pathname.includes("/client")) {
      setUserRole("client")
    } else {
      setUserRole(null)
    }
  }, [pathname])

  // Enlaces de navegación basados en el rol y estado de conexión
  const getNavLinks = () => {
    if (!connected) {
      return [{ href: "/", label: "Inicio", icon: <Home className="h-5 w-5" /> }]
    }

    if (userRole === "freelancer") {
      return [
        { href: "/", label: "Inicio", icon: <Home className="h-5 w-5" /> },
        { href: "/freelancer/dashboard", label: "Dashboard", icon: <User className="h-5 w-5" /> },
        { href: "/freelancer/services", label: "Mis Servicios", icon: <FileText className="h-5 w-5" /> },
      ]
    }

    if (userRole === "client") {
      return [
        { href: "/", label: "Inicio", icon: <Home className="h-5 w-5" /> },
        { href: "/client/dashboard", label: "Dashboard", icon: <Briefcase className="h-5 w-5" /> },
        { href: "/client/search", label: "Buscar Servicios", icon: <Search className="h-5 w-5" /> },
      ]
    }

    return [
      { href: "/", label: "Inicio", icon: <Home className="h-5 w-5" /> },
  
    ]
  }

  const navLinks = getNavLinks()

  const handleLogout = () => {
    disconnect()
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Link href="/" className="flex items-center">
            <span className="logo-text">
              <span className="solana-gradient-text">de</span>Lance
            </span>
          </Link>
        </div>

        {/* Navegación de escritorio */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-solana-purple flex items-center gap-1 ${
                pathname === link.href ? "text-solana-purple" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {connected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          )}
          <WalletButton />
        </nav>

        {/* Menú móvil */}
        <div className="flex md:hidden items-center gap-2">
          <WalletButton />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center font-bold text-xl">
                    <span className="logo-text">
                      <span className="solana-gradient-text">de</span>Lance
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Cerrar menú</span>
                  </Button>
                </div>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                        pathname === link.href ? "bg-accent text-solana-purple" : "text-muted-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                  {connected && (
                    <Button
                      variant="ghost"
                      className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      Cerrar sesión
                    </Button>
                  )}
                </nav>
                {userRole && (
                  <div className="mt-auto pt-4 border-t">
                    <Link
                      href="/role-selection"
                      className="flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Cambiar rol
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
