/**
 * Utilidades para la API
 */

// Función para validar campos requeridos
export function validateRequiredFields(body: any, fields: string[]): { valid: boolean; missing: string[] } {
  const missing = fields.filter((field) => !body[field])
  return {
    valid: missing.length === 0,
    missing,
  }
}

// Función para formatear errores de validación
export function formatValidationError(missing: string[]): { error: string } {
  return {
    error: `Campos requeridos faltantes: ${missing.join(", ")}`,
  }
}

// Función para simular una respuesta paginada
export function paginateResults<T>(
  results: T[],
  limit: number,
  offset: number,
): {
  data: T[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
} {
  const paginatedData = results.slice(offset, offset + limit)

  return {
    data: paginatedData,
    pagination: {
      total: results.length,
      limit,
      offset,
      hasMore: offset + limit < results.length,
    },
  }
}

// Función para simular un retraso en la respuesta (útil para pruebas)
export async function simulateDelay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Función para generar un ID único
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 15)
}

// Función para formatear errores
export function formatError(message: string, status = 500): { error: string; status: number } {
  return {
    error: message,
    status,
  }
}

// Función para validar una dirección de wallet de Solana (simplificada)
export function isValidSolanaAddress(address: string): boolean {
  // En una implementación real, validaríamos correctamente la dirección
  return address.length >= 10 && address.startsWith("solana")
}
