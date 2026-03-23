# SvShop Backend - Guia Manual Postman (Auth + Roles)

## 1. Objetivo
Validar autenticacion JWT y permisos por rol en el monolito, sin incluir invoices.

## 2. Base URL
- Local: `http://localhost:3000`

## 3. Endpoints clave
- Health: `GET /health`
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Products:
  - `GET /api/products` (publico)
  - `GET /api/products/:id` (publico)
  - `POST /api/products` (VENDEDOR o ADMINISTRADOR)
  - `PUT /api/products/:id` (VENDEDOR o ADMINISTRADOR)
  - `DELETE /api/products/:id` (ADMINISTRADOR)
- Cart (todos requieren token):
  - `GET /api/cart`
  - `POST /api/cart/items`
  - `PUT /api/cart/items/:productId`
  - `DELETE /api/cart/items/:productId`
  - `DELETE /api/cart`

## 4. Flujo recomendado de pruebas

### Paso 1: validar servidor
Request:
- Method: `GET`
- URL: `/health`
Expected: `200`

### Paso 2: registrar usuario cliente
Request:
- Method: `POST`
- URL: `/api/auth/register`
- Body JSON:
```json
{
  "nombre": "Cliente Demo",
  "email": "cliente.demo@svshop.com",
  "password": "DemoPass123!"
}
```
Expected: `201` con objeto `user` y rol `CLIENTE`.

### Paso 3: login correcto
Request:
- Method: `POST`
- URL: `/api/auth/login`
- Body JSON:
```json
{
  "email": "cliente.demo@svshop.com",
  "password": "DemoPass123!"
}
```
Expected: `200` con `token` JWT.

Guardar token en variable de Postman:
- Nombre sugerido: `tokenCliente`
- Valor: `response.token`

### Paso 4: usar token en rutas protegidas
Header en requests protegidos:
- `Authorization: Bearer {{tokenCliente}}`

Probar:
- `GET /api/cart` -> expected `200`
- `POST /api/cart/items` con body:
```json
{
  "productId": "<id_producto>",
  "cantidad": 1
}
```
Expected: `200` (si producto existe y hay stock).

### Paso 5: validar bloqueo tras intentos fallidos
Intentar login con password incorrecto 3 veces:
```json
{
  "email": "cliente.demo@svshop.com",
  "password": "PasswordIncorrecto1!"
}
```
Resultados esperados:
- Intento 1: `401`
- Intento 2: `401`
- Intento 3: `423` (bloqueo temporal)
- Nuevos intentos dentro de ventana de bloqueo: `423`

La duracion de bloqueo depende de la variable:
- `LOGIN_LOCK_MINUTES` (default: 15)

## 5. Matriz de permisos por rol

| Ruta | CLIENTE | VENDEDOR | ADMINISTRADOR |
|---|---|---|---|
| GET /api/products | SI | SI | SI |
| GET /api/products/:id | SI | SI | SI |
| POST /api/products | NO | SI | SI |
| PUT /api/products/:id | NO | SI | SI |
| DELETE /api/products/:id | NO | NO | SI |
| GET /api/cart | SI | SI | SI |
| POST /api/cart/items | SI | SI | SI |
| PUT /api/cart/items/:productId | SI | SI | SI |
| DELETE /api/cart/items/:productId | SI | SI | SI |
| DELETE /api/cart | SI | SI | SI |

## 6. Reglas de autenticacion implementadas
- JWT en header `Authorization: Bearer <token>`.
- Password hasheado con `bcrypt` en registro.
- Login con verificacion de password hasheado.
- Bloqueo temporal al alcanzar `LOGIN_MAX_ATTEMPTS` (default: 3).
- Registro fuerza rol `CLIENTE` para evitar asignacion de rol por cliente final.

## 7. Notas de alcance
- Este flujo no incluye invoices.
- Checkout del monolito no esta implementado funcionalmente en este alcance.
- Si ordenes se maneja por microservicio, la integracion se realiza en una fase posterior.
