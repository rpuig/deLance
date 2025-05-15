import { type NextRequest, NextResponse } from "next/server"

// GET /api/categories/[id]/services - Obtener servicios por categoría
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const categoryId = params.id
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const sort = searchParams.get("sort") || "rating" // rating, price_asc, price_desc, newest

    // En una implementación real, aquí consultarías tu base de datos
    // Simulamos servicios por categoría
    let services = []

    if (categoryId === "design") {
      services = [
        {
          id: "1",
          title: "Diseño de Logo Profesional",
          description: "Diseño de logos modernos y profesionales para tu negocio",
          freelancerId: "1",
          freelancerName: "Freelancer A",
          price: "2 SOL",
          deliveryTime: "3-5 días",
          rating: 4.8,
          reviews: 24,
        },
        {
          id: "5",
          title: "Diseño de Banners para Redes Sociales",
          description: "Banners atractivos para tus campañas en redes sociales",
          freelancerId: "5",
          freelancerName: "Freelancer E",
          price: "1.5 SOL",
          deliveryTime: "2-3 días",
          rating: 4.6,
          reviews: 18,
        },
        {
          id: "9",
          title: "Ilustraciones Personalizadas",
          description: "Ilustraciones únicas para tu sitio web o marca",
          freelancerId: "1",
          freelancerName: "Freelancer A",
          price: "3 SOL",
          deliveryTime: "5-7 días",
          rating: 4.9,
          reviews: 15,
        },
      ]
    } else if (categoryId === "development") {
      services = [
        {
          id: "2",
          title: "Desarrollo Web Full Stack",
          description: "Desarrollo de sitios web modernos y responsivos",
          freelancerId: "3",
          freelancerName: "Freelancer C",
          price: "5 SOL",
          deliveryTime: "7-10 días",
          rating: 4.9,
          reviews: 37,
        },
        {
          id: "6",
          title: "Desarrollo de API REST",
          description: "Creación de APIs RESTful para tu aplicación",
          freelancerId: "7",
          freelancerName: "Freelancer G",
          price: "4 SOL",
          deliveryTime: "5-7 días",
          rating: 4.7,
          reviews: 12,
        },
        {
          id: "10",
          title: "Desarrollo de Smart Contracts en Solana",
          description: "Desarrollo de smart contracts seguros y eficientes en Solana",
          freelancerId: "3",
          freelancerName: "Freelancer C",
          price: "8 SOL",
          deliveryTime: "10-14 días",
          rating: 5.0,
          reviews: 8,
        },
      ]
    } else if (categoryId === "marketing") {
      services = [
        {
          id: "3",
          title: "Marketing Digital",
          description: "Estrategias de marketing para aumentar tu presencia online",
          freelancerId: "1",
          freelancerName: "Freelancer A",
          price: "3 SOL",
          deliveryTime: "5-7 días",
          rating: 4.7,
          reviews: 18,
        },
        {
          id: "7",
          title: "Gestión de Redes Sociales",
          description: "Gestión profesional de tus perfiles en redes sociales",
          freelancerId: "9",
          freelancerName: "Freelancer I",
          price: "2.5 SOL",
          deliveryTime: "Mensual",
          rating: 4.5,
          reviews: 14,
        },
      ]
    } else {
      // Categoría no encontrada o sin servicios
      services = []
    }

    // Ordenar servicios según el parámetro sort
    if (sort === "rating") {
      services.sort((a, b) => b.rating - a.rating)
    } else if (sort === "price_asc") {
      services.sort((a, b) => Number.parseFloat(a.price) - Number.parseFloat(b.price))
    } else if (sort === "price_desc") {
      services.sort((a, b) => Number.parseFloat(b.price) - Number.parseFloat(a.price))
    } else if (sort === "newest") {
      // En una implementación real, ordenaríamos por fecha de creación
      // Aquí simplemente invertimos el array para simular
      services.reverse()
    }

    // Aplicar paginación
    const paginatedServices = services.slice(offset, offset + limit)

    return NextResponse.json({
      categoryId,
      services: paginatedServices,
      total: services.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error(`Error al obtener servicios de la categoría ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener servicios" }, { status: 500 })
  }
}
