import { type NextRequest, NextResponse } from "next/server"

// PUT /api/contracts/[id]/status - Actualizar el estado de un contrato
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validación básica
    if (!body.status) {
      return NextResponse.json({ error: "Se requiere el campo status" }, { status: 400 })
    }

    // Validar que el estado sea válido
    const validStatuses = ["in_progress", "delivered", "validated", "completed"]
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Estado no válido. Debe ser uno de: " + validStatuses.join(", ") },
        { status: 400 },
      )
    }

    // En una implementación real, aquí actualizarías el estado del contrato en tu base de datos
    // y también interactuarías con el smart contract de Solana para el escrow si es necesario

    let txId = null

    // Si el estado es "validated" o "completed", simularíamos la liberación del pago en el escrow
    if (body.status === "validated" || body.status === "completed") {
      // Simular transacción de Solana para liberar el pago
      txId = "solana_release_tx_" + Math.random().toString(36).substring(2, 15)
    }

    const updatedContract = {
      id,
      status: body.status,
      updatedAt: new Date().toISOString(),
      ...(body.status === "delivered" && { deliveredAt: new Date().toISOString() }),
      ...(body.status === "validated" && { validatedAt: new Date().toISOString() }),
      ...(body.status === "completed" && { completedAt: new Date().toISOString() }),
      ...(txId && { releaseTxId: txId }),
    }

    return NextResponse.json(updatedContract)
  } catch (error) {
    console.error(`Error al actualizar estado del contrato ${params.id}:`, error)
    return NextResponse.json({ error: "Error al actualizar estado del contrato" }, { status: 500 })
  }
}
