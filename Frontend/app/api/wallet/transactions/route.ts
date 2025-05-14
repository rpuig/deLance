import { type NextRequest, NextResponse } from "next/server"

// GET /api/wallet/transactions - Obtener transacciones de la wallet
export async function GET(request: NextRequest) {
  try {
    // En una implementación real, aquí consultarías las transacciones de la wallet en la blockchain de Solana
    // Simulamos la obtención de transacciones

    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!address) {
      return NextResponse.json({ error: "Se requiere el parámetro address" }, { status: 400 })
    }

    // Simulamos transacciones
    const transactions = [
      {
        id: "tx1",
        type: "payment",
        amount: "2.0",
        currency: "SOL",
        from: address.includes("2") ? address : "solana456...",
        to: address.includes("2") ? "solana123..." : address,
        status: "confirmed",
        timestamp: "2025-05-01T10:30:00.000Z",
        contractId: "1",
      },
      {
        id: "tx2",
        type: "payment",
        amount: "1.5",
        currency: "SOL",
        from: address.includes("4") ? address : "solana789...",
        to: address.includes("4") ? "solana123..." : address,
        status: "confirmed",
        timestamp: "2025-04-23T14:45:00.000Z",
        contractId: "3",
      },
      {
        id: "tx3",
        type: "escrow_deposit",
        amount: "5.0",
        currency: "SOL",
        from: address.includes("2") ? address : "solana456...",
        to: "escrow_contract_address",
        status: "confirmed",
        timestamp: "2025-05-02T09:15:00.000Z",
        contractId: "2",
      },
    ]

    // Aplicamos paginación
    const paginatedTransactions = transactions.slice(offset, offset + limit)

    return NextResponse.json({
      address,
      transactions: paginatedTransactions,
      total: transactions.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error al obtener transacciones:", error)
    return NextResponse.json({ error: "Error al obtener transacciones" }, { status: 500 })
  }
}
