import { type NextRequest, NextResponse } from "next/server"

// GET /api/contracts - Obtener todos los contratos
export async function GET(request: NextRequest) {
  try {
    // En una implementación real, aquí consultarías tu base de datos
    const contracts = [
      {
        id: "1",
        title: "Diseño de Logo para Startup",
        description: "Diseño de logo profesional para una startup de tecnología",
        serviceId: "1",
        freelancerId: "1",
        clientId: "2",
        price: "2 SOL",
        status: "in_progress", // in_progress, delivered, validated, completed
        createdAt: "2025-05-01T00:00:00.000Z",
        dueDate: "2025-05-15T00:00:00.000Z",
      },
      {
        id: "2",
        title: "Desarrollo Web para Tienda Online",
        description: "Desarrollo de sitio web para tienda de ropa",
        serviceId: "2",
        freelancerId: "3",
        clientId: "2",
        price: "5 SOL",
        status: "delivered",
        createdAt: "2025-05-02T00:00:00.000Z",
        dueDate: "2025-05-20T00:00:00.000Z",
      },
      {
        id: "3",
        title: "Diseño de Banner para Redes Sociales",
        description: "Diseño de banners para campaña en redes sociales",
        serviceId: "1",
        freelancerId: "1",
        clientId: "4",
        price: "1.5 SOL",
        status: "completed",
        createdAt: "2025-04-15T00:00:00.000Z",
        dueDate: "2025-04-25T00:00:00.000Z",
        completedAt: "2025-04-23T00:00:00.000Z",
      },
    ]

    // Soporte para filtrado por query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const freelancerId = searchParams.get("freelancerId")
    const clientId = searchParams.get("clientId")

    let filteredContracts = [...contracts]

    if (status) {
      filteredContracts = filteredContracts.filter((contract) => contract.status === status)
    }

    if (freelancerId) {
      filteredContracts = filteredContracts.filter((contract) => contract.freelancerId === freelancerId)
    }

    if (clientId) {
      filteredContracts = filteredContracts.filter((contract) => contract.clientId === clientId)
    }

    return NextResponse.json(filteredContracts)
  } catch (error) {
    console.error("Error al obtener contratos:", error)
    return NextResponse.json({ error: "Error al obtener contratos" }, { status: 500 })
  }
}

// POST /api/contracts - Crear un nuevo contrato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validación básica
    if (!body.title || !body.serviceId || !body.freelancerId || !body.clientId || !body.price || !body.dueDate) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // En una implementación real, aquí crearías el contrato en tu base de datos
    // y también interactuarías con el smart contract de Solana para el escrow
    const newContract = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description || "",
      serviceId: body.serviceId,
      freelancerId: body.freelancerId,
      clientId: body.clientId,
      price: body.price,
      status: "in_progress",
      createdAt: new Date().toISOString(),
      dueDate: body.dueDate,
      escrowTxId: "solana_tx_" + Math.random().toString(36).substring(2, 15),
    }

    return NextResponse.json(newContract, { status: 201 })
  } catch (error) {
    console.error("Error al crear contrato:", error)
    return NextResponse.json({ error: "Error al crear contrato" }, { status: 500 })
  }
}
