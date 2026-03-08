# Guía de configuración de variables de entorno para Docker

Este archivo explica cómo configurar correctamente las variables de entorno para el deploy en Docker.

## Estructura de archivos .env

```
SvShop-arquitectura/
├── .env                                    # Variables para docker-compose (VITE_API_URL)
├── .env.example                            # Ejemplo de .env raíz
├── svshop-backend/
│   ├── .env                                # Variables para Docker/Producción
│   ├── .env.example                        # Ejemplo de configuración
│   └── src/config/
│       ├── .env.development                # Variables para desarrollo local
│       └── .env.production                 # (Opcional) Variables para producción
├── svshop-orders-service/
│   ├── .env                                # Variables para Docker/Producción
│   └── .env.example                        # Ejemplo de configuración
```

## Variables por servicio

### 1. Frontend (SvShop)
**Archivo:** `.env` en la raíz del proyecto
- `VITE_API_URL`: URL del backend API
  - Docker: `http://localhost:3000/api`
  - Producción: `https://tu-dominio.com/api`

### 2. Backend (svshop-backend)
**Archivo:** `svshop-backend/.env`
- `NODE_ENV`: `production`
- `PORT`: `3000`
- `MONGO_URI`: MongoDB Atlas URI para la base de datos `svshop_main`
- `JWT_SECRET`: Clave secreta para JWT (mínimo 32 caracteres)
- `JWT_EXPIRES_IN`: `7d`
- `BCRYPT_SALT_ROUNDS`: `10`
- `MAX_IMAGE_SIZE_MB`: `3`
- `ORDERS_SERVICE_URL`: `http://svshop-orders-service:3001`

### 3. Orders Service (svshop-orders-service)
**Archivo:** `svshop-orders-service/.env`
- `NODE_ENV`: `production`
- `PORT`: `3001`
- `MONGO_URI`: MongoDB Atlas URI para la base de datos `svshop_orders`

## Importante

1. **Base de datos separadas:**
   - `svshop_main` para el monolito (users, products, carts, invoices)
   - `svshop_orders` para el microservicio (orders)

2. **Comunicación entre servicios:**
   - En Docker, usar nombres de servicios: `http://svshop-orders-service:3001`
   - En desarrollo local, usar: `http://localhost:3001`

3. **Seguridad:**
   - Cambiar `JWT_SECRET` por un valor seguro de al menos 32 caracteres
   - No subir archivos `.env` a Git (están en .gitignore)
   - Usar las credenciales correctas de MongoDB Atlas

4. **Frontend build:**
   - El `VITE_API_URL` se inyecta en build time, no en runtime
   - Debe apuntar a donde el navegador puede acceder al backend

## Comandos para deploy

```bash
# Build de todos los servicios
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener todos los servicios
docker-compose down
```
