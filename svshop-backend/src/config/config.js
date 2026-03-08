/**
 * Configuration Loader
 * Carga automáticamente variables de entorno según el ambiente
 */

const dotenv = require('dotenv');
const path = require('path');

// Determinar el ambiente (development, production)
const environment = process.env.NODE_ENV || 'development';

// En Docker o producción, usar .env directo desde la raíz del proyecto backend
// En desarrollo, usar .env.development/.env.production desde config/
let envPath;
if (process.env.DOCKER_ENV === 'true' || environment === 'production') {
  // Docker: buscar .env en la raíz del proyecto backend
  envPath = path.resolve(__dirname, '../../.env');
  console.log(`🐳 Cargando configuración de Docker desde raíz del proyecto`);
} else {
  // Desarrollo local: usar archivo específico del ambiente
  const envFile = `.env.${environment}`;
  envPath = path.resolve(__dirname, envFile);
  console.log(`🔧 Cargando configuración para ambiente: ${environment}`);
  console.log(`📄 Archivo: ${envFile}`);
}

// Cargar variables de entorno
dotenv.config({ path: envPath });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8080,
  
  // MongoDB
  MONGO_URI: process.env.MONGO_URI,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Bcrypt
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
  
  // Límites
  MAX_IMAGE_SIZE_MB: parseInt(process.env.MAX_IMAGE_SIZE_MB) || 3,

  // Microservicio
  ORDERS_SERVICE_URL: process.env.ORDERS_SERVICE_URL,
};

// Validar variables críticas en producción
if (config.NODE_ENV === 'production') {
  if (!config.MONGO_URI) {
    throw new Error('❌ ERROR: MONGO_URI debe estar definido en producción');
  }

  if (!config.JWT_SECRET || config.JWT_SECRET === 'your-secret-key-change-in-production') {
    throw new Error('❌ ERROR: JWT_SECRET debe estar definido con un valor seguro en producción');
  }

  if (!config.ORDERS_SERVICE_URL) {
  throw new Error('❌ ERROR: ORDERS_SERVICE_URL debe estar definido en producción');
}
}

// Validar en desarrollo
if (config.NODE_ENV === 'development') {
  if (!config.MONGO_URI) {
    console.warn('⚠️  ADVERTENCIA: MONGO_URI no está definido en .env.development');
  }
}

module.exports = config;
