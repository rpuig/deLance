import { type NextRequest, NextResponse } from "next/server"

// GET /api/users - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  try {
    // En una implementación real, aquí consultarías tu base de datos
    const users = [
      { id: "1", name: "Usuario 1", role: "freelancer", wallet: "solana123..." },
      { id: "2", name: "Usuario 2", role: "client", wallet: "solana456..." },
      { id: "3", name: "Usuario 3", role: "freelancer", wallet: "solana789..." },
    ]

    // Soporte para filtrado por query params
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")

    if (role) {
      const filteredUsers = users.filter((user) => user.role === role)
      return NextResponse.json(filteredUsers)
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

// POST /api/users - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validación básica
    if (!body.name || !body.wallet || !body.role) {
      return NextResponse.json({ error: "Se requieren los campos name, wallet y role" }, { status: 400 })
    }

    // En una implementación real, aquí crearías el usuario en tu base de datos
    const newUser = {
      id: Date.now().toString(),
      name: body.name,
      wallet: body.wallet,
      role: body.role,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
