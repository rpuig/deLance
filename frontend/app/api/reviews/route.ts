import { type NextRequest, NextResponse } from "next/server"

// GET /api/reviews - Obtener todas las valoraciones
export async function GET(request: NextRequest) {
  try {
    // En una implementación real, aquí consultarías tu base de datos
    const reviews = [
      {
        id: "1",
        contractId: "3",
        reviewerId: "2", // cliente
        revieweeId: "1", // freelancer
        rating: 5,
        comment: "Excelente trabajo, muy profesional y entregado a tiempo.",
        createdAt: "2025-04-23T00:00:00.000Z",
      },
      {
        id: "2",
        contractId: "3",
        reviewerId: "1", // freelancer
        revieweeId: "2", // cliente
        rating: 5,
        comment: "Cliente muy claro con sus requerimientos y pago puntual.",
        createdAt: "2025-04-23T00:00:00.000Z",
      },
      {
        id: "3",
        contractId: "4",
        reviewerId: "4", // cliente
        revieweeId: "3", // freelancer
        rating: 4,
        comment: "Buen trabajo, aunque necesitó algunas revisiones.",
        createdAt: "2025-04-15T00:00:00.000Z",
      },
    ]

    // Soporte para filtrado por query params
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get("contractId")
    const reviewerId = searchParams.get("reviewerId")
    const revieweeId = searchParams.get("revieweeId")

    let filteredReviews = [...reviews]

    if (contractId) {
      filteredReviews = filteredReviews.filter((review) => review.contractId === contractId)
    }

    if (reviewerId) {
      filteredReviews = filteredReviews.filter((review) => review.reviewerId === reviewerId)
    }

    if (revieweeId) {
      filteredReviews = filteredReviews.filter((review) => review.revieweeId === revieweeId)
    }

    return NextResponse.json(filteredReviews)
  } catch (error) {
    console.error("Error al obtener valoraciones:", error)
    return NextResponse.json({ error: "Error al obtener valoraciones" }, { status: 500 })
  }
}

// POST /api/reviews - Crear una nueva valoración
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validación básica
    if (!body.contractId || !body.reviewerId || !body.revieweeId || !body.rating) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Validar rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "El rating debe estar entre 1 y 5" }, { status: 400 })
    }

    // En una implementación real, aquí crearías la valoración en tu base de datos
    // y también verificarías que el contrato esté completado y que el usuario no haya dejado ya una valoración
    const newReview = {
      id: Date.now().toString(),
      contractId: body.contractId,
      reviewerId: body.reviewerId,
      revieweeId: body.revieweeId,
      rating: body.rating,
      comment: body.comment || "",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error("Error al crear valoración:", error)
    return NextResponse.json({ error: "Error al crear valoración" }, { status: 500 })
  }
}
