import { type NextRequest, NextResponse } from "next/server"

// Middleware para la API
export function middleware(request: NextRequest) {
  // Obtener la ruta de la API
  const path = request.nextUrl.pathname

  // Añadir encabezados comunes
  const response = NextResponse.next()
  response.headers.set("X-API-Version", "1.0.0")
  response.headers.set("X-API-Timestamp", new Date().toISOString())

  // Registrar la solicitud (en una implementación real, esto podría ir a un sistema de logs)
  console.log(`[API] ${request.method} ${path}`)

  // Aquí podrías implementar:
  // - Autenticación
  // - Rate limiting
  // - CORS
  // - Validación de tokens
  // - Etc.

  return response
}

// Configurar el middleware para que solo se ejecute en rutas de la API
export const config = {
  matcher: "/api/:path*",
}
