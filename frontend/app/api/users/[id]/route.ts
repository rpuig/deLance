import { type NextRequest, NextResponse } from "next/server"

// GET /api/users/[id] - Obtener un usuario específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // En una implementación real, aquí consultarías tu base de datos
    // Simulamos la búsqueda de un usuario
    const user = {
      id,
      name: `Usuario ${id}`,
      role: id === "1" ? "freelancer" : "client",
      wallet: `solana${id}...`,
      createdAt: "2025-05-01T00:00:00.000Z",
    }

    // Si no se encuentra el usuario
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error(`Error al obtener usuario ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

// PUT /api/users/[id] - Actualizar un usuario
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Validación básica
    if (!body.name && !body.role) {
      return NextResponse.json({ error: "Se requiere al menos un campo para actualizar" }, { status: 400 })
    }

    // En una implementación real, aquí actualizarías el usuario en tu base de datos
    // Simulamos la actualización
    const updatedUser = {
      id,
      name: body.name || `Usuario ${id}`,
      role: body.role || (id === "1" ? "freelancer" : "client"),
      wallet: `solana${id}...`,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error(`Error al actualizar usuario ${params.id}:`, error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Eliminar un usuario
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // En una implementación real, aquí eliminarías el usuario de tu base de datos
    // Simulamos la eliminación

    return NextResponse.json({ message: `Usuario ${id} eliminado correctamente` })
  } catch (error) {
    console.error(`Error al eliminar usuario ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
