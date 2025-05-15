import { type NextRequest, NextResponse } from "next/server"

// GET /api/reviews/[id] - Obtener una valoración específica
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // En una implementación real, aquí consultarías tu base de datos
    // Simulamos la búsqueda de una valoración
    const review = {
      id,
      contractId: "3",
      reviewerId: "2",
      revieweeId: "1",
      rating: 5,
      comment: "Excelente trabajo, muy profesional y entregado a tiempo.",
      createdAt: "2025-04-23T00:00:00.000Z",
    }

    // Si no se encuentra la valoración
    if (!review) {
      return NextResponse.json({ error: "Valoración no encontrada" }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error(`Error al obtener valoración ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener valoración" }, { status: 500 })
  }
}

// PUT /api/reviews/[id] - Actualizar una valoración
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validación básica
    if (!body.rating && !body.comment) {
      return NextResponse.json({ error: "Se requiere al menos un campo para actualizar" }, { status: 400 })
    }

    // Validar rating si está presente
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json({ error: "El rating debe estar entre 1 y 5" }, { status: 400 })
    }

    // En una implementación real, aquí actualizarías la valoración en tu base de datos
    // y verificarías que el usuario que actualiza es el mismo que la creó
    const updatedReview = {
      id,
      rating: body.rating || 5,
      comment: body.comment || "Comentario actualizado",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error(`Error al actualizar valoración ${params.id}:`, error)
    return NextResponse.json({ error: "Error al actualizar valoración" }, { status: 500 })
  }
}

// DELETE /api/reviews/[id] - Eliminar una valoración
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // En una implementación real, aquí eliminarías la valoración de tu base de datos
    // y verificarías que el usuario que elimina es el mismo que la creó

    return NextResponse.json({ message: `Valoración ${id} eliminada correctamente` })
  } catch (error) {
    console.error(`Error al eliminar valoración ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar valoración" }, { status: 500 })
  }
}
