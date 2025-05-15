"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, MessageSquare, Star } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useWallet } from "@/components/wallet-provider"

export default function ServiceDetail() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.id
  const [message, setMessage] = useState("")
  const { connected } = useWallet()

  // Redirigir si no está conectado
  useEffect(() => {
    if (!connected) {
      router.push("/connect")
    }
  }, [connected, router])

  // Datos de ejemplo - en una implementación real, estos datos vendrían de la blockchain o una API
  const service = {
    id: serviceId,
    title: "Diseño Gráfico Profesional",
    description:
      "Ofrezco servicios de diseño gráfico profesional para todo tipo de negocios. Especializado en logos, banners, ilustraciones y material de marketing.",
    freelancer: "Freelancer A",
    price: "2 SOL",
    deliveryTime: "3-5 días",
    rating: 4.8,
    reviewCount: 24,
    completedJobs: 47,
    portfolio: [
      { id: 1, title: "Logo para Startup", image: "/placeholder.svg?height=200&width=300" },
      { id: 2, title: "Banner para Redes Sociales", image: "/placeholder.svg?height=200&width=300" },
      { id: 3, title: "Ilustración para Sitio Web", image: "/placeholder.svg?height=200&width=300" },
    ],
    reviews: [
      {
        id: 1,
        client: "Cliente X",
        rating: 5,
        comment: "Excelente trabajo, muy profesional y entregado a tiempo.",
        date: "01/05/2025",
      },
      {
        id: 2,
        client: "Cliente Y",
        rating: 4,
        comment: "Buen trabajo, aunque necesitó algunas revisiones.",
        date: "15/04/2025",
      },
      {
        id: 3,
        client: "Cliente Z",
        rating: 5,
        comment: "Increíble atención al detalle y muy buena comunicación.",
        date: "01/04/2025",
      },
    ],
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // En una implementación real, aquí enviaríamos el mensaje a la blockchain o API
      alert("Mensaje enviado al freelancer")
      setMessage("")
    }
  }

  const handleHire = () => {
    // En una implementación real, aquí crearíamos un contrato en la blockchain
    alert("Redirigiendo al proceso de contratación...")
    router.push("/payment/new")
  }

  if (!connected) {
    return null // No renderizar nada mientras redirige
  }

  return (
    <div className="container py-8 px-4">
      <div className="mb-4">
        <Button
          variant="ghost"
          className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">{service.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">{service.title}</CardTitle>
              <CardDescription>
                Por: {service.freelancer} •
                <span className="inline-flex items-center ml-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  {service.rating} ({service.reviewCount} reseñas)
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Descripción del servicio</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <DollarSign className="h-6 w-6 text-solana-purple mb-2" />
                  <span className="text-sm text-gray-500">Precio</span>
                  <span className="font-medium">{service.price}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <Clock className="h-6 w-6 text-solana-purple mb-2" />
                  <span className="text-sm text-gray-500">Tiempo de entrega</span>
                  <span className="font-medium">{service.deliveryTime}</span>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg">
                  <CheckCircle className="h-6 w-6 text-solana-purple mb-2" />
                  <span className="text-sm text-gray-500">Trabajos completados</span>
                  <span className="font-medium">{service.completedJobs}</span>
                </div>
              </div>

              <Tabs defaultValue="portfolio">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="portfolio">Portafolio</TabsTrigger>
                  <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                </TabsList>

                <TabsContent value="portfolio" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.portfolio.map((item) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-3">
                          <p className="font-medium">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="pt-4 space-y-4">
                  {service.reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{review.client}</span>
                        <div className="flex items-center">
                          {Array(review.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          {Array(5 - review.rating)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{review.comment}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {review.date}
                      </p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contratar este servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Precio del servicio</span>
                  <span className="font-medium">{service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comisión de la plataforma</span>
                  <span className="font-medium">0.1 SOL</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>2.1 SOL</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-solana-purple hover:bg-solana-purple/90" onClick={handleHire}>
                Contratar ahora
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Contactar al freelancer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Escribe un mensaje para el freelancer..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mb-4"
                rows={4}
              />
              <Button
                className="w-full bg-solana-purple hover:bg-solana-purple/90"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                Enviar mensaje
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
