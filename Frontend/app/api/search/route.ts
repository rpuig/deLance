import { type NextRequest, NextResponse } from "next/server"

// GET /api/search - Búsqueda global en la plataforma
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase()
    const type = searchParams.get("type") // services, users, all
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    if (!query) {
      return NextResponse.json({ error: "Se requiere el parámetro q (query)" }, { status: 400 })
    }

    // En una implementación real, aquí consultarías tu base de datos
    // Simulamos resultados de búsqueda

    // Servicios de ejemplo
    const services = [
      {
        id: "1",
        type: "service",
        title: "Diseño Gráfico Profesional",
        description: "Servicios de diseño gráfico para todo tipo de negocios",
        freelancerId: "1",
        freelancerName: "Freelancer A",
        price: "2 SOL",
        rating: 4.8,
      },
      {
        id: "2",
        type: "service",
        title: "Desarrollo Web Full Stack",
        description: "Desarrollo de sitios web modernos y responsivos",
        freelancerId: "3",
        freelancerName: "Freelancer C",
        price: "5 SOL",
        rating: 4.9,
      },
      {
        id: "3",
        type: "service",
        title: "Marketing Digital",
        description: "Estrategias de marketing para aumentar tu presencia online",
        freelancerId: "1",
        freelancerName: "Freelancer A",
        price: "3 SOL",
        rating: 4.7,
      },
    ]

    // Usuarios de ejemplo
    const users = [
      {
        id: "1",
        type: "user",
        name: "Freelancer A",
        role: "freelancer",
        skills: ["Diseño Gráfico", "Marketing Digital"],
        rating: 4.8,
      },
      {
        id: "3",
        type: "user",
        name: "Freelancer C",
        role: "freelancer",
        skills: ["Desarrollo Web", "Desarrollo Móvil"],
        rating: 4.9,
      },
    ]

    // Filtrar por query
    const filteredServices = services.filter(
      (service) =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.freelancerName.toLowerCase().includes(query),
    )

    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        (user.skills && user.skills.some((skill) => skill.toLowerCase().includes(query))),
    )

    // Determinar qué resultados devolver según el tipo
    let results = []
    if (!type || type === "all") {
      results = [...filteredServices, ...filteredUsers]
    } else if (type === "services") {
      results = filteredServices
    } else if (type === "users") {
      results = filteredUsers
    }

    // Aplicar paginación
    const paginatedResults = results.slice(offset, offset + limit)

    return NextResponse.json({
      query,
      results: paginatedResults,
      total: results.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Error en la búsqueda:", error)
    return NextResponse.json({ error: "Error en la búsqueda" }, { status: 500 })
  }
}
