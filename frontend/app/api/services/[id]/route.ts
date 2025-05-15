import { type NextRequest, NextResponse } from "next/server"

// GET /api/services/[id] - Obtener un servicio específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // En una implementación real, aquí consultarías tu base de datos
    // Simulamos la búsqueda de un servicio
    const service = {
      id,
      title: id === "1" ? "Diseño Gráfico Profesional" : "Desarrollo Web Full Stack",
      description:
        id === "1"
          ? "Servicios de diseño gráfico para todo tipo de negocios"
          : "Desarrollo de sitios web modernos y responsivos",
      freelancerId: id === "1" ? "1" : "3",
      price: id === "1" ? "2 SOL" : "5 SOL",
      deliveryTime: id === "1" ? "3-5 días" : "7-10 días",
      category: id === "1" ? "design" : "development",
      createdAt: "2025-05-01T00:00:00.000Z",
      portfolio: [
        { id: "1", title: "Proyecto 1", image: "/placeholder.svg?height=200&width=300" },
        { id: "2", title: "Proyecto 2", image: "/placeholder.svg?height=200&width=300" },
      ],
      reviews: [
        {
          id: "1",
          clientId: "2",
          rating: 5,
          comment: "Excelente trabajo, muy profesional",
          date: "2025-04-15T00:00:00.000Z",
        },
        {
          id: "2",
          clientId: "4",
          rating: 4,
          comment: "Buen trabajo, entregado a tiempo",
          date: "2025-04-10T00:00:00.000Z",
        },
      ],
    }

    // Si no se encuentra el servicio
    if (!service) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error(`Error al obtener servicio ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener servicio" }, { status: 500 })
  }
}

// PUT /api/services/[id] - Actualizar un servicio
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validación básica
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Se requiere al menos un campo para actualizar" }, { status: 400 })
    }

    // En una implementación real, aquí actualizarías el servicio en tu base de datos
    // Simulamos la actualización
    const updatedService = {
      id,
      title: body.title || "Servicio actualizado",
      description: body.description || "Descripción actualizada",
      freelancerId: body.freelancerId || "1",
      price: body.price || "3 SOL",
      deliveryTime: body.deliveryTime || "4-6 días",
      category: body.category || "other",
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error(`Error al actualizar servicio ${params.id}:`, error)
    return NextResponse.json({ error: "Error al actualizar servicio" }, { status: 500 })
  }
}

// DELETE /api/services/[id] - Eliminar un servicio
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // En una implementación real, aquí eliminarías el servicio de tu base de datos
    // Simulamos la eliminación

    return NextResponse.json({ message: `Servicio ${id} eliminado correctamente` })
  } catch (error) {
    console.error(`Error al eliminar servicio ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar servicio" }, { status: 500 })
  }
}
