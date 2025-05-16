import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Obtener la dirección del freelancer de los parámetros de consulta
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ error: "Freelancer address is required" }, { status: 400 })
    }

    // En un entorno real, aquí consultarías tu base de datos
    // Por ahora, simulamos que obtenemos datos de una base de datos
    
    // Simulación: asignar una moneda preferida basada en el hash de la dirección
    // Esto es solo para demostración, en producción usarías datos reales
    const addressHash = address.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const tokens = ["USDC", "SOL", "USDT", "ETH"]
    const preferredToken = tokens[addressHash % tokens.length]

    return NextResponse.json({
      address,
      preferredToken,
      // Otros datos del perfil del freelancer podrían ir aquí
    })
  } catch (error: any) {
    console.error("Error fetching freelancer preferences:", error)
    return NextResponse.json({ error: error.message || "Error fetching preferences" }, { status: 500 })
  }
}