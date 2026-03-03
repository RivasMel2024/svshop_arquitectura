

## Estructura de carpetas — SvShop

```
SVSHOP-ARQUITECTURA/
│
├── SvShop/                          ← (tu carpeta actual, el frontend)
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/              ← Componentes reutilizables
│   │   │   ├── ui/                  ← Botones, inputs, modales
│   │   │   └── layout/              ← Navbar, Sidebar, Footer
│   │   ├── pages/                   ← Una carpeta por módulo
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
│   └── vite.config.js
│
├── svshop-backend/                  ← Monolito Modular (Node.js + Express)
│   ├── src/
│   │   ├── modules/                 ← Un módulo por dominio
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.js
│   │   │   │   ├── auth.service.js
│   │   │   │   ├── auth.routes.js
│   │   │   │   └── auth.middleware.js
│   │   │   ├── users/
│   │   │   │   ├── user.controller.js
│   │   │   │   ├── user.service.js
│   │   │   │   ├── user.routes.js
│   │   │   │   └── user.model.js
│   │   │   ├── products/
│   │   │   │   ├── product.controller.js
│   │   │   │   ├── product.service.js
│   │   │   │   ├── product.routes.js
│   │   │   │   └── product.model.js
│   │   │   ├── cart/
│   │   │   │   ├── cart.controller.js
│   │   │   │   ├── cart.service.js
│   │   │   │   ├── cart.routes.js
│   │   │   │   └── cart.model.js
│   │   │   └── invoices/
│   │   │       ├── invoice.controller.js
│   │   │       ├── invoice.service.js
│   │   │       ├── invoice.routes.js
│   │   │       └── invoice.model.js
│   │   ├── config/
│   │   │   ├── db.js                ← Conexión MongoDB (Singleton)
│   │   │   └── env.js               ← Variables de entorno
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js   ← Verificación JWT
│   │   │   ├── role.middleware.js   ← Verificación de roles
│   │   │   └── error.middleware.js  ← Manejo global de errores
│   │   └── app.js                   ← Punto de entrada Express
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── svshop-orders-service/           ← Microservicio de Órdenes (Node.js + Express)
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
│   └── package.json
│
└── README.md                        ← Documentación general del monorepo
```

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

## Bases de Datos

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

## Decisiones de implementación derivadas de tus notas

Estas quedan registradas como parte del diseño del proyecto:

**Imágenes**
- Se convierten a base64 antes de almacenarse en MongoDB
- Límite de 3MB por imagen en validación del backend

**Catálogo y listados**
- Filtros por categoría, precio y disponibilidad
- Paginación de 10 o 20 registros en todas las tablas y listados
- Estado de pedidos: `CREADA → ACEPTADA → PROCESANDO → ENVIADA → ENTREGADA`

**Panel administrativo**
- Gráfica de ventas (cantidad) y de vendedores activos

**Descuentos**
- El campo `descuento.activo` permanece como booleano
- El campo `descuento.porcentaje` se elimina del modelo
- Se mantiene `descuento.fechaFin` para indicar cuándo expira el descuento (comportamiento tipo Temu)
- Se elimina `descuento.precioFinal` como campo calculado fijo; el precio con descuento se calcula en tiempo real cuando `activo = true` y `fechaFin` no ha expirado

**Seguridad de pagos**
- No se almacenan datos de tarjeta directamente
- Se usa tokenización vía bcrypt/hash para los datos sensibles
- Se implementan vistas específicas estándar para formularios de tarjeta de crédito

**Facturación**
- El formulario de checkout incluye tipo de documento: **Consumidor Final** o **Crédito Fiscal**
- Esto afecta el formato del JSON de factura generado en MongoDB

**Auditoría**
- Se agrega registro de auditoría a nivel de módulo de usuarios y productos (quién hizo qué y cuándo)

**Implementar al final (baja prioridad)**
- Envío de correo de confirmación de orden (CU-11 completo con SMTP)

---