/**
 * Configuration - Orders Microservice
 * Carga variables de entorno del archivo .env
 */

require('dotenv').config();

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  
  // MongoDB
  MONGO_URI: process.env.MONGO_URI,
  
  // JWT - DEBE COINCIDIR con el del backend monolito para validar tokens
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
};

// Validar variables críticas en producción
if (config.NODE_ENV === 'production') {
  if (!config.MONGO_URI) {
    throw new Error('❌ ERROR: MONGO_URI debe estar definido en producción');
  }

  if (!config.JWT_SECRET || config.JWT_SECRET === 'your-secret-key-change-in-production') {
    throw new Error('❌ ERROR: JWT_SECRET debe estar definido con un valor seguro en producción (DEBE COINCIDIR con el backend)');
  }
}

module.exports = config;
