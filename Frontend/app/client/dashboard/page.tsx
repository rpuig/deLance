"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Star } from "lucide-react"
import { useWallet } from "@/components/wallet-provider"
import { useRouter } from "next/navigation"

export default function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const { connected } = useWallet()
  const router = useRouter()

  // Redirigir si no está conectado
  useEffect(() => {
    if (!connected) {
      router.push("/connect")
    }
  }, [connected, router])

  // Datos de ejemplo
  const activeContracts = [
    {
      id: 1,
      title: "Diseño de Logo",
      freelancer: "Freelancer A",
      price: "2 SOL",
      status: "En progreso",
      dueDate: "15/06/2025",
    },
    {
      id: 2,
      title: "Desarrollo Web",
      freelancer: "Freelancer B",
      price: "5 SOL",
      status: "Esperando entrega",
      dueDate: "20/06/2025",
    },
  ]

  const completedContracts = [
    { id: 3, title: "Diseño de Banner", freelancer: "Freelancer C", price: "1.5 SOL", status: "Completado", rating: 5 },
    { id: 4, title: "Edición de Video", freelancer: "Freelancer D", price: "3 SOL", status: "Completado", rating: 4 },
  ]

  const searchResults = [
    {
      id: 1,
      title: "Diseño Gráfico Profesional",
      freelancer: "Freelancer A",
      price: "2-5 SOL",
      rating: 4.8,
      reviews: 24,
    },
    {
      id: 2,
      title: "Desarrollo Web Full Stack",
      freelancer: "Freelancer B",
      price: "5-10 SOL",
      rating: 4.9,
      reviews: 37,
    },
    { id: 3, title: "Marketing Digital", freelancer: "Freelancer C", price: "3-7 SOL", rating: 4.7, reviews: 18 },
    { id: 4, title: "Edición de Video", freelancer: "Freelancer D", price: "2-6 SOL", rating: 4.6, reviews: 15 },
  ]

  if (!connected) {
    return null // No renderizar nada mientras redirige
  }

  return (
    <div className="container py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Panel de Cliente</h1>
        </div>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-5">
          <TabsTrigger value="search">Buscar</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              className="pl-10"
              placeholder="Buscar servicios o freelancers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((result) => (
              <Card key={result.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                  <CardDescription>Por: {result.freelancer}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="flex">
                        {Array(Math.floor(result.rating))
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        {result.rating % 1 > 0 && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                        {Array(5 - Math.ceil(result.rating))
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-gray-300" />
                          ))}
                      </div>
                      <span className="text-sm ml-1">
                        {result.rating} ({result.reviews} reseñas)
                      </span>
                    </div>
                    <span className="font-medium">{result.price}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-solana-purple hover:bg-solana-purple/90"
                    onClick={() => router.push(`/service/${result.id}`)}
                  >
                    Ver detalles
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeContracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <CardTitle className="text-lg sm:text-xl">{contract.title}</CardTitle>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium w-fit">
                    {contract.status}
                  </span>
                </div>
                <CardDescription>Freelancer: {contract.freelancer}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Precio</p>
                    <p className="font-medium">{contract.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha límite</p>
                    <p className="font-medium">{contract.dueDate}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => router.push(`/contract/${contract.id}`)}
                >
                  Ver detalles
                </Button>
                {contract.status === "Esperando entrega" && (
                  <Button
                    className="w-full sm:w-auto bg-solana-purple hover:bg-solana-purple/90"
                    onClick={() => router.push(`/contract/${contract.id}`)}
                  >
                    Validar entrega
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}

          {activeContracts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No tienes contratos activos actualmente</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedContracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <CardTitle className="text-lg sm:text-xl">{contract.title}</CardTitle>
                  <span className="px-2 py-1 bg-solana-blue/20 text-solana-blue rounded-full text-xs font-medium w-fit">
                    {contract.status}
                  </span>
                </div>
                <CardDescription>Freelancer: {contract.freelancer}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Precio</p>
                    <p className="font-medium">{contract.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tu valoración</p>
                    <div className="flex items-center">
                      {Array(contract.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      {Array(5 - contract.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-gray-300" />
                        ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => router.push(`/contract/${contract.id}`)}
                >
                  Ver detalles
                </Button>
              </CardFooter>
            </Card>
          ))}

          {completedContracts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No tienes contratos completados</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
