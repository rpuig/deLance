import { type NextRequest, NextResponse } from "next/server"

// GET /api/services - Obtener todos los servicios
export async function GET(request: NextRequest) {
  try {
    // En una implementación real, aquí consultarías tu base de datos
    const services = [
      {
        id: "1",
        title: "Diseño Gráfico Profesional",
        description: "Servicios de diseño gráfico para todo tipo de negocios",
        freelancerId: "1",
        price: "2 SOL",
        deliveryTime: "3-5 días",
        category: "design",
        createdAt: "2025-05-01T00:00:00.000Z",
      },
      {
        id: "2",
        title: "Desarrollo Web Full Stack",
        description: "Desarrollo de sitios web modernos y responsivos",
        freelancerId: "3",
        price: "5 SOL",
        deliveryTime: "7-10 días",
        category: "development",
        createdAt: "2025-05-02T00:00:00.000Z",
      },
      {
        id: "3",
        title: "Marketing Digital",
        description: "Estrategias de marketing para aumentar tu presencia online",
        freelancerId: "1",
        price: "3 SOL",
        deliveryTime: "5-7 días",
        category: "marketing",
        createdAt: "2025-05-03T00:00:00.000Z",
      },
    ]

    // Soporte para filtrado por query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const freelancerId = searchParams.get("freelancerId")
    const search = searchParams.get("search")?.toLowerCase()

    let filteredServices = [...services]

    if (category) {
      filteredServices = filteredServices.filter((service) => service.category === category)
    }

    if (freelancerId) {
      filteredServices = filteredServices.filter((service) => service.freelancerId === freelancerId)
    }

    if (search) {
      filteredServices = filteredServices.filter(
        (service) => service.title.toLowerCase().includes(search) || service.description.toLowerCase().includes(search),
      )
    }

    return NextResponse.json(filteredServices)
  } catch (error) {
    console.error("Error al obtener servicios:", error)
    return NextResponse.json({ error: "Error al obtener servicios" }, { status: 500 })
  }
}

// POST /api/services - Crear un nuevo servicio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validación básica
    if (!body.title || !body.description || !body.freelancerId || !body.price || !body.deliveryTime) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // En una implementación real, aquí crearías el servicio en tu base de datos
    const newService = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      freelancerId: body.freelancerId,
      price: body.price,
      deliveryTime: body.deliveryTime,
      category: body.category || "other",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Error al crear servicio:", error)
    return NextResponse.json({ error: "Error al crear servicio" }, { status: 500 })
  }
}
