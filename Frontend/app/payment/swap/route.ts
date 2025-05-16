import { type NextRequest, NextResponse } from "next/server"
import { OrderlyAPI } from "@/lib/orderly-api"

export async function POST(request: NextRequest) {
  try {
    const { fromToken, toToken, amount } = await request.json()

    // Validar los datos de entrada
    if (!fromToken || !toToken || !amount) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Inicializar el cliente de Orderly
    const orderlyAPI = new OrderlyAPI({
      apiKey: process.env.ORDERLY_API_KEY!,
      apiSecret: process.env.ORDERLY_API_SECRET!,
      network: process.env.ORDERLY_NETWORK || "testnet",
    })

    // Realizar el swap
    const swapResult = await orderlyAPI.swapTokens(fromToken, toToken, amount)

    if (!swapResult.success) {
      return NextResponse.json({ error: `Swap failed: ${swapResult.error}` }, { status: 500 })
    }

    // Devolver el resultado exitoso
    return NextResponse.json({
      success: true,
      fromToken,
      toToken,
      originalAmount: amount,
      receivedAmount: swapResult.receivedAmount,
      txHash: swapResult.txHash,
    })
  } catch (error: any) {
    console.error("Error processing swap:", error)
    return NextResponse.json({ error: error.message || "Error processing swap" }, { status: 500 })
  }
}