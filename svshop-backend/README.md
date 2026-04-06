# SvShop Backend - Monolito Modular

Backend del e-commerce SvShop construido con arquitectura de monolito modular.

## Stack Tecnológico

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: JWT (jsonwebtoken)
- **Seguridad**: bcrypt para hash de contraseñas

## Estructura de Módulos

El backend está organizado en módulos independientes:

- **auth**: Registro, login y autenticación
- **users**: CRUD de usuarios y gestión de roles
- **products**: Catálogo de productos con filtros y paginación
- **cart**: Carrito de compras
- **invoices**: Generación y gestión de facturas

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.example .env

# Configurar variables de entorno en .env
# Asegúrate de cambiar JWT_SECRET en producción
```

## Scripts Disponibles

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## Variables de Entorno

Ver archivo `.env` para configuración completa.

Variables críticas:
- `MONGO_URI`: URL de conexión a MongoDB
- `JWT_SECRET`: Secreto para firmar tokens JWT (¡cambiar en producción!)
- `PORT`: Puerto del servidor (default: 5000)

## Endpoints Principales

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Users
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)

### Products
- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (vendedor/admin)
- `PUT /api/products/:id` - Actualizar producto (vendedor/admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Cart
- `GET /api/cart` - Obtener carrito del usuario
- `POST /api/cart/items` - Agregar producto al carrito
- `PUT /api/cart/items/:productId` - Actualizar cantidad
- `DELETE /api/cart/items/:productId` - Eliminar producto
- `DELETE /api/cart` - Vaciar carrito

### Invoices
- `POST /api/invoices` - Crear factura
- `GET /api/invoices/:id` - Obtener factura
- `GET /api/invoices/user/:userId` - Listar facturas del usuario

## Arquitectura

### Patrón de Capas

Cada módulo sigue estrictamente esta estructura:

1. **Controller**: Recibe HTTP, valida entrada, delega al servicio
2. **Service**: Contiene TODA la lógica de negocio
3. **Routes**: Define las rutas Express
4. **Model**: Define el schema de Mongoose

### Middlewares Globales

- `auth.middleware.js`: Verificación de JWT
- `role.middleware.js`: Control de acceso por roles
- `error.middleware.js`: Manejo centralizado de errores

## Roles de Usuario

- `CLIENTE`: Usuario estándar (puede comprar)
- `VENDEDOR`: Puede gestionar productos
- `ADMINISTRADOR`: Acceso completo al sistema

## Base de Datos

Base de datos: `svshop_main`

Colecciones:
- `users`
- `products`
- `carts`
- `invoices`

