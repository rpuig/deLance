import { NextResponse } from "next/server"

// GET /api/health - Verificar el estado de la API
export async function GET() {
  try {
    const healthStatus = {
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    }

    return NextResponse.json(healthStatus)
  } catch (error) {
    console.error("Error al verificar estado de la API:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Error interno del servidor",
      },
      { status: 500 },
    )
  }
}
