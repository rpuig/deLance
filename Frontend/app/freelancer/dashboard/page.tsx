"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Star } from "lucide-react"
import { useWallet } from "@/components/wallet-provider"
import { useRouter } from "next/navigation"

export default function FreelancerDashboard() {
  const [showPublishForm, setShowPublishForm] = useState(false)
  const { connected } = useWallet()
  const router = useRouter()

  // Redirigir si no está conectado
  useEffect(() => {
    if (!connected) {
      router.push("/connect")
    }
  }, [connected, router])

  // Datos de ejemplo
  const activeJobs = [
    {
      id: 1,
      title: "Diseño de Logo",
      client: "Cliente A",
      price: "2 SOL",
      status: "En progreso",
      dueDate: "15/06/2025",
    },
    {
      id: 2,
      title: "Desarrollo Web",
      client: "Cliente B",
      price: "5 SOL",
      status: "Esperando entrega",
      dueDate: "20/06/2025",
    },
  ]

  const completedJobs = [
    { id: 3, title: "Diseño de Banner", client: "Cliente C", price: "1.5 SOL", status: "Completado", rating: 5 },
    { id: 4, title: "Edición de Video", client: "Cliente D", price: "3 SOL", status: "Completado", rating: 4 },
  ]

  if (!connected) {
    return null // No renderizar nada mientras redirige
  }

  return (
    <div className="container py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Panel de Freelancer</h1>
        </div>
      </div>

      {!showPublishForm ? (
        <>
          <Button className="mb-5 bg-solana-purple hover:bg-solana-purple/90" onClick={() => setShowPublishForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Publicar Nuevo Servicio
          </Button>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-5">
              <TabsTrigger value="active">Trabajos Activos</TabsTrigger>
              <TabsTrigger value="completed">Completados</TabsTrigger>
              <TabsTrigger value="services">Mis Servicios</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <CardTitle className="text-lg sm:text-xl">{job.title}</CardTitle>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium w-fit">
                        {job.status}
                      </span>
                    </div>
                    <CardDescription>Cliente: {job.client}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Precio</p>
                        <p className="font-medium">{job.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha límite</p>
                        <p className="font-medium">{job.dueDate}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => router.push(`/contract/${job.id}`)}
                    >
                      Ver detalles
                    </Button>
                    <Button className="w-full sm:w-auto bg-solana-purple hover:bg-solana-purple/90">
                      Entregar trabajo
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {activeJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No tienes trabajos activos actualmente</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <CardTitle className="text-lg sm:text-xl">{job.title}</CardTitle>
                      <span className="px-2 py-1 bg-solana-blue/20 text-solana-blue rounded-full text-xs font-medium w-fit">
                        {job.status}
                      </span>
                    </div>
                    <CardDescription>Cliente: {job.client}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Precio</p>
                        <p className="font-medium">{job.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Valoración</p>
                        <div className="flex items-center">
                          {Array(job.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          {Array(5 - job.rating)
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
                      onClick={() => router.push(`/contract/${job.id}`)}
                    >
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              {completedJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No tienes trabajos completados</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Diseño Gráfico</CardTitle>
                  <CardDescription>Logos, banners, ilustraciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Ofrezco servicios de diseño gráfico profesional para todo tipo de negocios.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Precio base</p>
                      <p className="font-medium">2 SOL</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tiempo de entrega</p>
                      <p className="font-medium">3-5 días</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Editar
                  </Button>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Desarrollo Web</CardTitle>
                  <CardDescription>Sitios web, landing pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    Desarrollo sitios web modernos y responsivos utilizando las últimas tecnologías.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Precio base</p>
                      <p className="font-medium">5 SOL</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tiempo de entrega</p>
                      <p className="font-medium">7-10 días</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Editar
                  </Button>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Eliminar
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Publicar Nuevo Servicio</CardTitle>
            <CardDescription>Completa el formulario para publicar un nuevo servicio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del servicio</Label>
              <Input id="title" placeholder="Ej: Diseño de logos profesionales" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Diseño Gráfico</SelectItem>
                  <SelectItem value="development">Desarrollo Web</SelectItem>
                  <SelectItem value="marketing">Marketing Digital</SelectItem>
                  <SelectItem value="writing">Redacción</SelectItem>
                  <SelectItem value="video">Video y Animación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" placeholder="Describe detalladamente el servicio que ofreces..." rows={5} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio base (SOL)</Label>
                <Input id="price" type="number" min="0.1" step="0.1" placeholder="Ej: 2.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery">Tiempo de entrega (días)</Label>
                <Input id="delivery" type="number" min="1" placeholder="Ej: 3" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowPublishForm(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button className="w-full sm:w-auto bg-solana-purple hover:bg-solana-purple/90">Publicar Servicio</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
