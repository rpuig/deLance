import { type NextRequest, NextResponse } from "next/server"

// GET /api/categories - Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    // En una implementación real, aquí consultarías tu base de datos
    const categories = [
      {
        id: "design",
        name: "Diseño Gráfico",
        description: "Servicios de diseño gráfico, logos, banners, etc.",
        servicesCount: 50,
      },
      {
        id: "development",
        name: "Desarrollo Web",
        description: "Desarrollo de sitios web, aplicaciones, etc.",
        servicesCount: 70,
      },
      {
        id: "marketing",
        name: "Marketing Digital",
        description: "Servicios de marketing, SEO, redes sociales, etc.",
        servicesCount: 30,
      },
      {
        id: "writing",
        name: "Redacción",
        description: "Servicios de redacción, traducción, etc.",
        servicesCount: 25,
      },
      {
        id: "video",
        name: "Video y Animación",
        description: "Servicios de edición de video, animación, etc.",
        servicesCount: 20,
      },
      {
        id: "other",
        name: "Otros",
        description: "Otros servicios",
        servicesCount: 5,
      },
    ]

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}
