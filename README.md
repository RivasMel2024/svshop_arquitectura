## Estructura de carpetas — SvShop

```
SVSHOP-ARQUITECTURA/
│
├── SvShop/                          ← Frontend (React.js + Vite)
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/                  ← Botones, inputs, modales
│   │   │   └── layout/              ← Navbar, Sidebar, Footer
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── catalog/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── admin/
│   │   │   └── vendor/
│   │   ├── services/                ← Llamadas a la API (axios)
│   │   ├── context/                 ← AuthContext, CartContext
│   │   ├── hooks/                   ← Custom hooks
│   │   └── utils/                   ← Helpers, formatos, validaciones
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.js
│
├── svshop-backend/                  ← Monolito Modular (Node.js + Express)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/                ← P3 Melisa
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.service.js
│   │   │   │   └── auth.routes.js
│   │   │   ├── users/               ← P3 Melisa (incluye funciones de admin)
│   │   │   │   ├── user.controller.js
│   │   │   │   ├── user.service.js
│   │   │   │   ├── user.routes.js
│   │   │   │   └── user.model.js
│   │   │   ├── products/            ← P4 Diego (incluye gestión de inventario)
│   │   │   │   ├── product.controller.js
│   │   │   │   ├── product.service.js
│   │   │   │   ├── product.routes.js
│   │   │   │   └── product.model.js
│   │   │   ├── cart/                ← P4 Diego
│   │   │   │   ├── cart.controller.js
│   │   │   │   ├── cart.service.js
│   │   │   │   ├── cart.routes.js
│   │   │   │   └── cart.model.js
│   │   │   ├── checkout/            ← P4 Diego (llama al microservicio de órdenes)
│   │   │   │   ├── checkout.controller.js
│   │   │   │   ├── checkout.service.js
│   │   │   │   └── checkout.routes.js
│   │   │   └── invoices/            ← P5 Carlos (persiste en svshop_main)
│   │   │       ├── invoice.controller.js
│   │   │       ├── invoice.service.js
│   │   │       ├── invoice.routes.js
│   │   │       └── invoice.model.js
│   │   ├── config/
│   │   │   ├── db.js                ← Conexión MongoDB (Singleton)
│   │   │   └── env.js               ← Variables de entorno
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   ← Verificación JWT (P3 Melisa)
│   │   │   ├── role.middleware.js   ← Verificación de roles (P3 Melisa)
│   │   │   └── error.middleware.js  ← Manejo global de errores
│   │   └── app.js                   ← Punto de entrada Express
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile
│   └── package.json
│
├── svshop-orders-service/           ← Microservicio de Órdenes (Node.js + Express) — P5 Carlos
│   ├── src/
│   │   ├── modules/
│   │   │   └── orders/
│   │   │       ├── order.controller.js
│   │   │       ├── order.service.js
│   │   │       ├── order.routes.js
│   │   │       └── order.model.js
│   │   ├── config/
│   │   │   ├── db.js                ← Conexión svshop_orders (Singleton propio)
│   │   │   └── env.js
│   │   ├── middlewares/
│   │   │   └── error.middleware.js
│   │   └── app.js
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml               ← Orquesta los 3 servicios
├── .env.example                     ← Plantilla de variables de entorno
└── README.md
```

---

## División de trabajo

| Persona | Nombre        | Capa     | Responsabilidad                                                                                     |
|---------|---------------|----------|-----------------------------------------------------------------------------------------------------|
| **P1**  | Alisson y Fiore | Frontend | Páginas de cliente: catálogo, búsqueda, detalle de producto, carrito, checkout                    |
| **P2**  | Alisson y Fiore | Frontend | Auth (login/registro), vistas de administrador y vendedor (dashboards, CRUD, gráfica)             |
| **P3**  | Melisa        | Backend  | Módulos `auth` y `users` — registro, login, JWT, roles, CRUD de usuarios, middlewares             |
| **P4**  | Diego         | Backend  | Módulos `products`, `cart` y `checkout` — catálogo, filtros, paginación, imágenes base64, stock, auditoría, llamada al microservicio |
| **P5**  | Carlos        | Backend  | Módulo `invoices` (en monolito) + Microservicio de órdenes completo (`svshop-orders-service`)     |

---

## Bases de Datos

### `svshop_main` — BD del monolito modular
- `users`
- `products`
- `carts`
- `facturas` ← vive en el monolito, se genera antes de llamar al microservicio

### `svshop_orders` — BD del microservicio
- `orders` ← única colección, solo el microservicio accede aquí

> ⚠ Las dos BDs nunca se comunican directamente. Son Bounded Contexts independientes.

---

## Decisiones de implementación

**Imágenes**
- Se convierten a base64 antes de almacenarse en MongoDB
- Límite de 3MB por imagen

**Catálogo y listados**
- Filtros por categoría, precio y disponibilidad
- Paginación de 10 o 20 registros en todas las tablas y listados
- Estado de pedidos: `CREADA → ACEPTADA → PROCESANDO → ENVIADA → ENTREGADA`

**Descuentos**
- Campo `descuento.activo` booleano
- Campo `descuento.fechaFin` para expiración automática
- El precio con descuento se calcula en tiempo real (no se persiste)
- No existe campo `descuento.porcentaje` ni `descuento.precioFinal`

**Facturación**
- El JSON de factura se genera y persiste en `svshop_main` (colección `facturas`)
- Se genera en el monolito **antes** de llamar al microservicio
- Si el microservicio falla, la factura ya quedó persistida — garantiza resiliencia
- El formulario de checkout incluye tipo de documento: `CONSUMIDOR_FINAL` o `CREDITO_FISCAL`
- El envío por correo (SMTP/Nodemailer) se implementa al final — baja prioridad

**Seguridad**
- Hash de contraseñas con bcrypt
- JWT stateless en header `Authorization: Bearer <token>`
- Bloqueo temporal de 15 minutos tras 5 intentos fallidos de login
- No se almacenan datos de tarjeta en crudo

**Auditoría**
- Registro en módulos `users` y `products`: quién hizo qué y cuándo

**Validación de inputs**
- Se usa `express-validator` directamente en las routes
- Nunca se pasa `req.body` completo al modelo; siempre se destructura

**Docker**
- Cada servicio tiene su propio `Dockerfile`
- `docker-compose.yml` en la raíz orquesta los 3 contenedores
- MongoDB corre en Atlas (fuera de Docker)
- Las URLs entre servicios usan el nombre del contenedor, nunca `localhost`:
  - El backend llama al microservicio como `http://svshop-orders-service:3001`

---

## Variables de entorno (`.env.example`)

```env
# svshop-backend
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=
JWT_EXPIRES_IN=7d
ORDERS_SERVICE_URL=http://svshop-orders-service:3001

# svshop-orders-service
PORT=3001
MONGO_URI=mongodb+srv://...

# SvShop (frontend)
VITE_API_URL=http://svshop-backend:3000/api
```

---

## Lo que NO se implementa en este MVP
- Notificaciones masivas por email o SMS
- Campañas de marketing
- Tickets de soporte técnico
- Cupones de descuento
- Pasarela de pago real (el checkout es una simulación)
- Envío y logística
- Reportes contables avanzados