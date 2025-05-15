import { type NextRequest, NextResponse } from "next/server"

// GET /api/wallet/balance - Obtener el balance de la wallet
export async function GET(request: NextRequest) {
  try {
    // En una implementación real, aquí consultarías el balance de la wallet en la blockchain de Solana
    // Simulamos la obtención del balance

    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Se requiere el parámetro address" }, { status: 400 })
    }

    // Simulamos diferentes balances según la dirección
    let balance = "10.5"
    if (address.includes("1")) {
      balance = "15.2"
    } else if (address.includes("2")) {
      balance = "8.7"
    } else if (address.includes("3")) {
      balance = "20.1"
    }

    return NextResponse.json({
      address,
      balance,
      currency: "SOL",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error al obtener balance:", error)
    return NextResponse.json({ error: "Error al obtener balance" }, { status: 500 })
  }
}
