import { type NextRequest, NextResponse } from "next/server"

// GET /api/contracts/[id]/messages - Obtener mensajes de un contrato
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // En una implementación real, aquí consultarías tu base de datos
    // Simulamos la búsqueda de mensajes
    const messages = [
      {
        id: "1",
        contractId: id,
        senderId: "2",
        content: "Hola, necesito un diseño minimalista y moderno.",
        timestamp: "2025-05-01T10:30:00.000Z",
      },
      {
        id: "2",
        contractId: id,
        senderId: id === "1" ? "1" : "3",
        content: "Perfecto, trabajaré en algunas propuestas. ¿Tienes alguna preferencia de color?",
        timestamp: "2025-05-01T11:15:00.000Z",
      },
      {
        id: "3",
        contractId: id,
        senderId: "2",
        content: "Me gustaría usar tonos azules y verdes, representan bien nuestra marca.",
        timestamp: "2025-05-01T12:00:00.000Z",
      },
    ]

    return NextResponse.json(messages)
  } catch (error) {
    console.error(`Error al obtener mensajes del contrato ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

// POST /api/contracts/[id]/messages - Enviar un nuevo mensaje
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validación básica
    if (!body.senderId || !body.content) {
      return NextResponse.json({ error: "Se requieren los campos senderId y content" }, { status: 400 })
    }

    // En una implementación real, aquí crearías el mensaje en tu base de datos
    const newMessage = {
      id: Date.now().toString(),
      contractId: id,
      senderId: body.senderId,
      content: body.content,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error(`Error al enviar mensaje al contrato ${params.id}:`, error)
    return NextResponse.json({ error: "Error al enviar mensaje" }, { status: 500 })
  }
}
