// Esta clase maneja las interacciones con la API de Orderly desde el servidor
export class OrderlyAPI {
    private apiKey: string
    private apiSecret: string
    private baseUrl: string
  
    constructor({
      apiKey,
      apiSecret,
      network = "testnet",
    }: {
      apiKey: string
      apiSecret: string
      network?: string
    }) {
      this.apiKey = apiKey
      this.apiSecret = apiSecret
      this.baseUrl = network === "mainnet" ? "https://api.orderly.org/v1" : "https://testnet-api.orderly.org/v1"
    }
  
    // Generar firma para las solicitudes a la API
    private generateSignature(timestamp: number, method: string, path: string, body?: any): string {
      const message = `${timestamp}${method}${path}${body ? JSON.stringify(body) : ""}`
  
      // En un entorno real, usaríamos crypto para generar la firma HMAC
      // Aquí simplemente simulamos la firma
      // No usamos bs58 directamente aquí para evitar problemas de compatibilidad
      return "simulated_signature"
    }
  
    // Realizar una solicitud a la API de Orderly
    private async request(method: string, path: string, body?: any) {
      const timestamp = Date.now()
      const signature = this.generateSignature(timestamp, method, path, body)
  
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          "orderly-timestamp": timestamp.toString(),
          "orderly-signature": signature,
          "orderly-key": this.apiKey,
        },
        body: body ? JSON.stringify(body) : undefined,
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Error en API de Orderly: ${errorData.message || response.statusText}`)
      }
  
      return await response.json()
    }
  
    // Obtener cotización para un swap
    async getSwapQuote(fromToken: string, toToken: string, amount: number) {
      return this.request("GET", `/swap/quote?fromToken=${fromToken}&toToken=${toToken}&amount=${amount}`)
    }
  
    // Ejecutar un swap
    async swapTokens(fromToken: string, toToken: string, amount: number) {
      try {
        // 1. Obtener cotización
        const quote = await this.getSwapQuote(fromToken, toToken, amount)
  
        // 2. Ejecutar el swap
        const result = await this.request("POST", "/swap/execute", {
          fromToken,
          toToken,
          amount,
          minReceived: quote.minReceived,
        })
  
        return {
          success: true,
          txHash: result.txHash,
          receivedAmount: result.receivedAmount,
        }
      } catch (error: any) {
        console.error("Error al realizar swap:", error)
        return {
          success: false,
          error: error.message,
        }
      }
    }
  
    // Obtener tokens disponibles
    async getAvailableTokens() {
      const response = await this.request("GET", "/public/tokens")
      return response.data
    }
  }
  