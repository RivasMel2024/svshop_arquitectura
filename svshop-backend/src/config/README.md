# Configuración de Ambientes - SvShop Backend

## 📁 Estructura de Archivos de Configuración

```
svshop-backend/src/config/
├── .env.default      ✅ (Template - SE SUBE A GIT)
├── .env.development  ❌ (Desarrollo local - NO SE SUBE)
├── .env.production   ❌ (Producción - NO SE SUBE)
├── config.js         ✅ (Carga automática por ambiente)
├── db.js             ✅ (Conexión MongoDB)
└── env.js            ⚠️  (DEPRECADO - usar config.js)
```

## 🚀 Uso

### 1. **Desarrollo Local**
```bash
npm run dev
```
- Usa: `.env.development`
- MongoDB: `mongodb://localhost:27017/svshop_main` (Compass)
- Puerto: `8080`

### 2. **Producción**
```bash
npm start
```
- Usa: `.env.production`
- MongoDB: Atlas (Cloud)
- Puerto: `3000`

## ⚙️ Configuración Inicial

1. **Copia el template:**
   ```bash
   # Ya están creados, pero si necesitas restaurar:
   cp src/config/.env.default src/config/.env.development
   cp src/config/.env.default src/config/.env.production
   ```

2. **Configura las variables:**
   - **Development:** Usa MongoDB Compass (local)
   - **Production:** Usa MongoDB Atlas + JWT seguro

## 🔐 Variables de Entorno

| Variable | Desarrollo | Producción | Descripción |
|----------|-----------|------------|-------------|
| `NODE_ENV` | `development` | `production` | Ambiente de ejecución |
| `PORT` | `8080` | `3000` | Puerto del servidor |
| `MONGO_URI` | Compass local | Atlas cloud | Conexión MongoDB |
| `JWT_SECRET` | `dev-secret-key...` | `prod-secret-key...` | Secreto para JWT |
| `JWT_EXPIRES_IN` | `12h` | `12h` | Expiración del token |
| `BCRYPT_SALT_ROUNDS` | `10` | `10` | Rounds para bcrypt |
| `MAX_IMAGE_SIZE_MB` | `3` | `3` | Tamaño máx. de imagen |

## ⚠️ Seguridad

- ✅ **NUNCA subas** `.env.development` o `.env.production` a Git
- ✅ **SÍ sube** `.env.default` como plantilla
- ⚠️ **CAMBIA** `JWT_SECRET` en producción por una clave segura
- 🔒 Los archivos están protegidos en `.gitignore`

## 📝 Notas

- El sistema carga automáticamente el archivo correcto según `NODE_ENV`
- Si falta una variable crítica en producción, la app **no arrancará**
- En desarrollo, solo muestra advertencias
