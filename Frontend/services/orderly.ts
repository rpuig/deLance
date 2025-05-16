"use client"
import { type OrderlyAppConfig, useOrderlyContext } from "@orderly.network/hooks"

// Configuración de Orderly
export const orderlyConfig: OrderlyAppConfig = {
  network: process.env.NEXT_PUBLIC_ORDERLY_NETWORK || "testnet",
  brokerId: process.env.NEXT_PUBLIC_ORDERLY_BROKER_ID || "orderly",
  brokerName: "Orderly",
  appName: "deLance",
}

// Clase para manejar las operaciones de Orderly
export class OrderlyService {
  private client: any

  constructor(client: any) {
    this.client = client
  }

  // Realizar swap de una moneda a otra
  async swapTokens(
    fromToken: string,
    toToken: string,
    amount: number,
  ): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      // Obtener cotización para el swap
      const quote = await this.client.swap.getQuote({
        fromToken,
        toToken,
        amount,
        slippage: 0.5, // 0.5% de slippage por defecto
      })

      // Ejecutar el swap
      const swapResult = await this.client.swap.executeSwap({
        fromToken,
        toToken,
        amount,
        minReceived: quote.minReceived,
      })

      return {
        success: true,
        txHash: swapResult.txHash,
      }
    } catch (error: any) {
      console.error("Error en swap de tokens:", error)
      return {
        success: false,
        error: error.message || "Error desconocido durante el swap",
      }
    }
  }

  // Obtener balance de una moneda específica
  async getTokenBalance(token: string): Promise<number> {
    try {
      const balances = await this.client.account.getBalances()
      const tokenBalance = balances.find((b: any) => b.token === token)
      return tokenBalance ? Number.parseFloat(tokenBalance.free) : 0
    } catch (error) {
      console.error("Error al obtener balance:", error)
      return 0
    }
  }

  // Obtener lista de tokens disponibles
  async getAvailableTokens(): Promise<string[]> {
    try {
      const tokens = await this.client.market.getTokens()
      return tokens.map((t: any) => t.symbol)
    } catch (error) {
      console.error("Error al obtener tokens disponibles:", error)
      return []
    }
  }
}

// Hook personalizado para usar el servicio de Orderly
export function useOrderlyService() {
  const { client } = useOrderlyContext()

  if (!client) {
    throw new Error("Orderly client no está disponible. Asegúrate de usar este hook dentro de OrderlyProvider")
  }

  return new OrderlyService(client)
}
