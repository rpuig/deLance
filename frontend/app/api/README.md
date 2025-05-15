# API de SolanaFreelance

Esta API proporciona endpoints RESTful para la plataforma SolanaFreelance, permitiendo la interacción con usuarios, servicios, contratos, pagos y valoraciones.

## Estructura de la API

La API sigue una estructura RESTful con los siguientes recursos principales:

- `/api/users`: Gestión de usuarios (freelancers y clientes)
- `/api/services`: Gestión de servicios ofrecidos por freelancers
- `/api/contracts`: Gestión de contratos entre freelancers y clientes
- `/api/reviews`: Gestión de valoraciones
- `/api/wallet`: Operaciones relacionadas con wallets de Solana
- `/api/stats`: Estadísticas de la plataforma
- `/api/search`: Búsqueda global
- `/api/categories`: Categorías de servicios

## Documentación

La documentación completa de la API está disponible en `/api/docs`.

## Autenticación

En una implementación real, esta API requeriría autenticación mediante tokens JWT o firmas de wallet de Solana. Actualmente, la autenticación no está implementada en esta versión de demostración.

## Ejemplos de uso

### Obtener todos los servicios
\`\`\`
GET /api/services
\`\`\`

### Filtrar servicios por categoría
\`\`\`
GET /api/services?category=design
\`\`\`

### Crear un nuevo contrato
\`\`\`
POST /api/contracts
Content-Type: application/json

{
  "title": "Diseño de Logo para Startup",
  "serviceId": "1",
  "freelancerId": "1",
  "clientId": "2",
  "price": "2 SOL",
  "dueDate": "2025-05-15T00:00:00.000Z",
  "description": "Diseño de logo profesional para una startup de tecnología"
}
\`\`\`

### Actualizar el estado de un contrato
\`\`\`
PUT /api/contracts/1/status
Content-Type: application/json

{
  "status": "delivered"
}
\`\`\`

## Códigos de estado HTTP

- `200 OK`: La solicitud se ha completado correctamente
- `201 Created`: El recurso se ha creado correctamente
- `400 Bad Request`: La solicitud contiene datos inválidos
- `404 Not Found`: El recurso solicitado no existe
- `500 Internal Server Error`: Error interno del servidor

## Paginación

Los endpoints que devuelven múltiples resultados soportan paginación mediante los parámetros `limit` y `offset`:

\`\`\`
GET /api/services?limit=10&offset=0
\`\`\`

## Ordenación

Algunos endpoints soportan ordenación mediante el parámetro `sort`:

\`\`\`
GET /api/categories/design/services?sort=rating
\`\`\`

## Implementación

Esta API está implementada utilizando los route handlers de Next.js App Router, lo que permite una fácil integración con el frontend de la aplicación.
