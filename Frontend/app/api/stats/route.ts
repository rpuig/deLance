import { type NextRequest, NextResponse } from "next/server"

// GET /api/stats - Obtener estadísticas de la plataforma
export async function GET(request: NextRequest) {
  try {
    // En una implementación real, aquí consultarías tu base de datos para obtener estadísticas
    // Simulamos estadísticas de la plataforma

    const stats = {
      users: {
        total: 150,
        freelancers: 100,
        clients: 50,
        newThisMonth: 25,
      },
      services: {
        total: 200,
        byCategory: {
          design: 50,
          development: 70,
          marketing: 30,
          writing: 25,
          other: 25,
        },
      },
      contracts: {
        total: 180,
        active: 50,
        completed: 130,
        totalValue: "540 SOL",
      },
      transactions: {
        total: 310,
        totalValue: "620 SOL",
        thisMonth: {
          count: 45,
          value: "120 SOL",
        },
      },
      ratings: {
        averageFreelancer: 4.7,
        averageClient: 4.8,
        totalReviews: 260,
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
