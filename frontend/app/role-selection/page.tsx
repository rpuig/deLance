"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, UserCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/components/wallet-provider"
import { useEffect } from "react"

export default function RoleSelection() {
  const router = useRouter()
  const { connected } = useWallet()

  // Redirigir si no está conectado
  useEffect(() => {
    if (!connected) {
      router.push("/connect")
    }
  }, [connected, router])

  const selectRole = (role: "freelancer" | "client") => {
    // En una implementación real, guardaríamos el rol en el estado global o localStorage
    if (role === "freelancer") {
      router.push("/freelancer/dashboard")
    } else {
      router.push("/client/dashboard")
    }
  }

  if (!connected) {
    return null // No renderizar nada mientras redirige
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Elige tu Rol</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => selectRole("freelancer")}>
            <CardHeader className="text-center pb-4">
              <UserCircle className="h-16 w-16 mx-auto text-solana-purple mb-2" />
              <CardTitle className="text-2xl">Freelancer</CardTitle>
              <CardDescription>Ofrece tus servicios y habilidades</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="bg-solana-purple/20 text-solana-purple rounded-full h-5 w-5 flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Publica tus servicios
                </li>
                <li className="flex items-center">
                  <span className="bg-solana-purple/20 text-solana-purple rounded-full h-5 w-5 flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Recibe pagos en Solana
                </li>
                <li className="flex items-center">
                  <span className="bg-solana-purple/20 text-solana-purple rounded-full h-5 w-5 flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Construye tu reputación
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-solana-purple hover:bg-solana-purple/90">Continuar como Freelancer</Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => selectRole("client")}>
            <CardHeader className="text-center pb-4">
              <Briefcase className="h-16 w-16 mx-auto text-solana-purple mb-2" />
              <CardTitle className="text-2xl">Cliente</CardTitle>
              <CardDescription>Encuentra talento para tus proyectos</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="bg-solana-purple/20 text-solana-purple rounded-full h-5 w-5 flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Busca freelancers calificados
                </li>
                <li className="flex items-center">
                  <span className="bg-solana-purple/20 text-solana-purple rounded-full h-5 w-5 flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Paga de forma segura con escrow
                </li>
                <li className="flex items-center">
                  <span className="bg-solana-purple/20 text-solana-purple rounded-full h-5 w-5 flex items-center justify-center mr-2 text-xs">
                    ✓
                  </span>
                  Valida el trabajo entregado
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-solana-purple hover:bg-solana-purple/90">Continuar como Cliente</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
