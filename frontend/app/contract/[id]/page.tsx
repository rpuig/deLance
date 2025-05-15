"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle, Clock, FileText, MessageSquare, Send, Star } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useWallet } from "@/components/wallet-provider"

export default function ContractDetail() {
  const params = useParams()
  const router = useRouter()
  const contractId = params.id
  const [message, setMessage] = useState("")
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const { connected } = useWallet()

  // Redirigir si no está conectado
  useEffect(() => {
    if (!connected) {
      router.push("/connect")
    }
  }, [connected, router])

  // Datos de ejemplo - en una implementación real, estos datos vendrían de la blockchain o una API
  const contract = {
    id: contractId,
    title: "Diseño de Logo para Startup",
    description:
      "Diseño de logo profesional para una startup de tecnología, incluyendo 3 propuestas y 2 rondas de revisiones.",
    freelancer: "Freelancer A",
    client: "Cliente B",
    price: "2 SOL",
    status: "En progreso", // En progreso, Entregado, Validado, Completado
    createdAt: "01/06/2025",
    dueDate: "15/06/2025",
    progress: 60,
    messages: [
      {
        id: 1,
        sender: "Cliente B",
        content: "Hola, necesito un logo minimalista y moderno.",
        timestamp: "01/06/2025 10:30",
      },
      {
        id: 2,
        sender: "Freelancer A",
        content: "Perfecto, trabajaré en algunas propuestas. ¿Tienes alguna preferencia de color?",
        timestamp: "01/06/2025 11:15",
      },
      {
        id: 3,
        sender: "Cliente B",
        content: "Me gustaría usar tonos azules y verdes, representan bien nuestra marca.",
        timestamp: "01/06/2025 12:00",
      },
    ],
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // En una implementación real, aquí enviaríamos el mensaje a la blockchain o API
      setMessage("")
    }
  }

  const handleDeliverWork = () => {
    // En una implementación real, aquí marcaríamos el trabajo como entregado en la blockchain
    alert("Trabajo marcado como entregado. El cliente debe validarlo para liberar el pago.")
  }

  const handleValidateWork = () => {
    // En una implementación real, aquí validaríamos el trabajo en la blockchain
    setShowRating(true)
  }

  const handleSubmitRating = () => {
    // En una implementación real, aquí enviaríamos la valoración a la blockchain
    alert("¡Trabajo validado y pago liberado! Gracias por tu valoración.")
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
        <h1 className="text-2xl font-bold">{contract.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <CardDescription>
                    Contrato #{contract.id} • Creado el {contract.createdAt}
                  </CardDescription>
                </div>
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium w-fit">
                  {contract.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Descripción del proyecto
                </h3>
                <p className="text-gray-600">{contract.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Freelancer</p>
                  <p className="font-medium">{contract.freelancer}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cliente</p>
                  <p className="font-medium">{contract.client}</p>
                </div>
                <div>
                  <p className="text-gray-500">Precio</p>
                  <p className="font-medium">{contract.price}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha límite</p>
                  <p className="font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-yellow-600" />
                    {contract.dueDate}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Progreso
                  </h3>
                  <span>{contract.progress}%</span>
                </div>
                <Progress value={contract.progress} className="h-2" />
              </div>

              {showRating ? (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Valora el trabajo recibido</h3>
                  <div className="flex items-center justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer ${
                          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  <Textarea placeholder="Deja un comentario sobre tu experiencia (opcional)..." className="mb-4" />
                  <Button
                    className="w-full bg-solana-purple hover:bg-solana-purple/90"
                    onClick={handleSubmitRating}
                    disabled={rating === 0}
                  >
                    Enviar valoración y liberar pago
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end">
                  {contract.status === "En progreso" && (
                    <Button className="bg-solana-purple hover:bg-solana-purple/90" onClick={handleDeliverWork}>
                      Marcar como entregado
                    </Button>
                  )}

                  {contract.status === "Entregado" && (
                    <Button className="bg-solana-purple hover:bg-solana-purple/90" onClick={handleValidateWork}>
                      Validar entrega y liberar pago
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Mensajes
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto">
              <div className="space-y-4">
                {contract.messages.map((msg) => (
                  <div key={msg.id} className="flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{msg.sender}</span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">{msg.content}</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex w-full items-center space-x-2">
                <Textarea
                  placeholder="Escribe un mensaje..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  size="icon"
                  className="bg-solana-purple hover:bg-solana-purple/90"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Enviar mensaje</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
