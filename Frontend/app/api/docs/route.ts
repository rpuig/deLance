import { NextResponse } from "next/server"

// GET /api/docs - Obtener documentación de la API
export async function GET() {
  try {
    const apiDocs = {
      title: "SolanaFreelance API Documentation",
      version: "1.0.0",
      baseUrl: "/api",
      endpoints: [
        {
          path: "/users",
          methods: ["GET", "POST"],
          description: "Gestión de usuarios",
          params: {
            GET: {
              role: "Filtrar por rol (freelancer, client)",
            },
            POST: {
              name: "Nombre del usuario (requerido)",
              wallet: "Dirección de wallet Solana (requerido)",
              role: "Rol del usuario (requerido: freelancer, client)",
            },
          },
        },
        {
          path: "/users/:id",
          methods: ["GET", "PUT", "DELETE"],
          description: "Operaciones sobre un usuario específico",
          params: {
            PUT: {
              name: "Nombre del usuario",
              role: "Rol del usuario",
            },
          },
        },
        {
          path: "/services",
          methods: ["GET", "POST"],
          description: "Gestión de servicios",
          params: {
            GET: {
              category: "Filtrar por categoría",
              freelancerId: "Filtrar por ID de freelancer",
              search: "Buscar por texto en título o descripción",
            },
            POST: {
              title: "Título del servicio (requerido)",
              description: "Descripción del servicio (requerido)",
              freelancerId: "ID del freelancer (requerido)",
              price: "Precio en SOL (requerido)",
              deliveryTime: "Tiempo de entrega (requerido)",
              category: "Categoría del servicio",
            },
          },
        },
        {
          path: "/services/:id",
          methods: ["GET", "PUT", "DELETE"],
          description: "Operaciones sobre un servicio específico",
        },
        {
          path: "/contracts",
          methods: ["GET", "POST"],
          description: "Gestión de contratos",
          params: {
            GET: {
              status: "Filtrar por estado (in_progress, delivered, validated, completed)",
              freelancerId: "Filtrar por ID de freelancer",
              clientId: "Filtrar por ID de cliente",
            },
            POST: {
              title: "Título del contrato (requerido)",
              serviceId: "ID del servicio (requerido)",
              freelancerId: "ID del freelancer (requerido)",
              clientId: "ID del cliente (requerido)",
              price: "Precio en SOL (requerido)",
              dueDate: "Fecha límite (requerido)",
              description: "Descripción del contrato",
            },
          },
        },
        {
          path: "/contracts/:id",
          methods: ["GET", "PUT"],
          description: "Operaciones sobre un contrato específico",
        },
        {
          path: "/contracts/:id/status",
          methods: ["PUT"],
          description: "Actualizar el estado de un contrato",
          params: {
            PUT: {
              status: "Nuevo estado (requerido: in_progress, delivered, validated, completed)",
            },
          },
        },
        {
          path: "/contracts/:id/messages",
          methods: ["GET", "POST"],
          description: "Gestión de mensajes de un contrato",
          params: {
            POST: {
              senderId: "ID del remitente (requerido)",
              content: "Contenido del mensaje (requerido)",
            },
          },
        },
        {
          path: "/reviews",
          methods: ["GET", "POST"],
          description: "Gestión de valoraciones",
          params: {
            GET: {
              contractId: "Filtrar por ID de contrato",
              reviewerId: "Filtrar por ID de quien valora",
              revieweeId: "Filtrar por ID de quien es valorado",
            },
            POST: {
              contractId: "ID del contrato (requerido)",
              reviewerId: "ID de quien valora (requerido)",
              revieweeId: "ID de quien es valorado (requerido)",
              rating: "Valoración de 1 a 5 (requerido)",
              comment: "Comentario de la valoración",
            },
          },
        },
        {
          path: "/reviews/:id",
          methods: ["GET", "PUT", "DELETE"],
          description: "Operaciones sobre una valoración específica",
        },
        {
          path: "/wallet/balance",
          methods: ["GET"],
          description: "Obtener el balance de una wallet",
          params: {
            GET: {
              address: "Dirección de la wallet (requerido)",
            },
          },
        },
        {
          path: "/wallet/transactions",
          methods: ["GET"],
          description: "Obtener transacciones de una wallet",
          params: {
            GET: {
              address: "Dirección de la wallet (requerido)",
              limit: "Límite de resultados (default: 10)",
              offset: "Offset para paginación (default: 0)",
            },
          },
        },
        {
          path: "/stats",
          methods: ["GET"],
          description: "Obtener estadísticas de la plataforma",
        },
        {
          path: "/search",
          methods: ["GET"],
          description: "Búsqueda global en la plataforma",
          params: {
            GET: {
              q: "Término de búsqueda (requerido)",
              type: "Tipo de resultados (services, users, all)",
              limit: "Límite de resultados (default: 10)",
              offset: "Offset para paginación (default: 0)",
            },
          },
        },
        {
          path: "/categories",
          methods: ["GET"],
          description: "Obtener todas las categorías",
        },
        {
          path: "/categories/:id/services",
          methods: ["GET"],
          description: "Obtener servicios por categoría",
          params: {
            GET: {
              limit: "Límite de resultados (default: 10)",
              offset: "Offset para paginación (default: 0)",
              sort: "Ordenar por (rating, price_asc, price_desc, newest)",
            },
          },
        },
      ],
    }

    return NextResponse.json(apiDocs)
  } catch (error) {
    console.error("Error al obtener documentación de la API:", error)
    return NextResponse.json({ error: "Error al obtener documentación" }, { status: 500 })
  }
}
