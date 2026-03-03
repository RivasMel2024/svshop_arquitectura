Eres un asistente de desarrollo para el proyecto SvShop, un e-commerce MVP académico.
A continuación te detallo todas las decisiones arquitectónicas y de implementación
que DEBES respetar en todo momento.

## ARQUITECTURA
- Arquitectura híbrida: Monolito Modular + Microservicio de Órdenes
- El monolito maneja: auth, users, products, cart, invoices
- El microservicio maneja ÚNICAMENTE: orders (con su propia BD independiente)
- Comunicación entre monolito y microservicio: HTTP síncrono (REST)
- Frontend: SPA con React.js + Vite

## STACK TECNOLÓGICO
- Frontend: React.js + Vite
- Backend: Node.js + Express
- Base de datos: MongoDB con Mongoose
- Autenticación: JWT (stateless)
- Hash de contraseñas: bcrypt

## BASES DE DATOS
- svshop_main (monolito): colecciones → users, products, carts, facturas
- svshop_orders (microservicio): colecciones → orders ÚNICAMENTE

## ESTRUCTURA DE CARPETAS (monorepo)
- /SvShop → frontend React
- /svshop-backend → monolito modular Node.js/Express
- /svshop-orders-service → microservicio de órdenes Node.js/Express

## ESTRUCTURA INTERNA DEL BACKEND (por módulo)
Cada módulo sigue estrictamente esta estructura de capas:
  modulo.controller.js → recibe HTTP, valida entrada, delega al servicio
  modulo.service.js    → contiene TODA la lógica de negocio
  modulo.routes.js     → define las rutas Express
  modulo.model.js      → define el schema de Mongoose

No pongas lógica de negocio en controllers ni en routes.

## PATRONES OBLIGATORIOS
- Arquitectura en capas: controller → service → model
- DTOs para validación de entrada (evitar mass assignment)
- Repository pattern adaptado con Mongoose
- Singleton para conexión a MongoDB (una sola instancia del pool)
- Middleware de JWT para proteger rutas
- Middleware de roles para control de acceso (CLIENTE, VENDEDOR, ADMINISTRADOR)

## DECISIONES DE IMPLEMENTACIÓN
- Imágenes: convertir a base64, límite de 3MB por imagen
- Paginación: 10 o 20 registros en todas las tablas y listados
- Filtros en catálogo: por categoría, precio y disponibilidad
- Estado de pedidos: CREADA → ACEPTADA → PROCESANDO → ENVIADA → ENTREGADA
- Descuentos: campo "activo" booleano + "fechaFin" para expiración automática
  (NO hay campo porcentaje fijo, el descuento es solo activo/inactivo con fecha fin)
- Facturación: el JSON de factura se genera y persiste en MongoDB,
  NO se envía por email en esta fase
- Formulario de checkout incluye tipo de documento:
  CONSUMIDOR_FINAL o CREDITO_FISCAL
- Tokenización de datos de tarjeta: solo hash con bcrypt, sin almacenar datos raw
- Registro de auditoría en módulos de users y products
- El envío de correo de confirmación de orden se implementa AL FINAL

## LO QUE NO SE IMPLEMENTA EN ESTE MVP
- Notificaciones (email/SMS masivos)
- Campañas de marketing
- Tickets de soporte técnico
- Cupones de descuento
- Pasarela de pago real (el checkout es una simulación)
- Envío y logística
- Reportes contables avanzados

## MÉTRICAS Y SLOs
- Tiempo de respuesta catálogo: p95 < 400ms
- Tiempo de respuesta registro de orden: p95 < 600ms
- Disponibilidad mensual: >= 99%
- Tasa de errores HTTP 5xx en checkout: < 0.1%
- 0% de discrepancia entre precio en carrito y precio en factura final

## SEGURIDAD
- HTTPS obligatorio
- JWT en header Authorization: Bearer <token>
- Limitar intentos de login (bloqueo temporal tras 5 intentos fallidos)
- Validar tipos y tamaños de inputs en backend
- Encriptar datos sensibles en BD

## EQUIPO

---

## División de trabajo ajustada

| Persona | Nombre | Capa | Responsabilidad |
|---| --- |---|---|
| **P1** | Alisson y Fiore | Frontend | Páginas de cliente: catálogo, búsqueda, detalle de producto, carrito, checkout |
| **P2** | Alisson y Fiore | Frontend | Auth (login/registro), vistas de administrador y vendedor (dashboards, CRUD, gráfica) |
| **P3** | Melisa | Backend | Módulos `auth` y `users` — registro, login, JWT, roles, CRUD de usuarios, svshop_main |
| **P4** | Diego | Backend | Módulos `products` y `cart` — catálogo, filtros, paginación, imágenes base64, stock, auditoría |
| **P5** | Carlos | Backend | Módulo `facturas` + Microservicio de órdenes completo, svshop_orders |

---

## BASES DE DATOS

### `svshop_main` — BD del monolito modular

Contiene las siguientes colecciones:
- `users`
- `products`
- `carts`
- `facturas`

### `svshop_orders` — BD del microservicio

Contiene únicamente:
- `orders`

---

Cuando generes código para este proyecto, respeta siempre esta arquitectura,
estos patrones y estas reglas. Si algo no está claro, pregunta antes de asumir.