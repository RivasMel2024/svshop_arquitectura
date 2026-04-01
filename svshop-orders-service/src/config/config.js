/**
 * Configuration - Orders Microservice
 * Carga variables de entorno del archivo .env
 */

const dotenv = require('dotenv');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';

// En desarrollo cargar .env.development (Mongo local), en producción .env
const envFile = environment === 'development' ? '.env.development' : '.env';
const envPath = path.resolve(__dirname, '../../', envFile);
dotenv.config({ path: envPath });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  
  // MongoDB
  MONGO_URI: process.env.MONGO_URI,
  
  // JWT - DEBE COINCIDIR con el del backend monolito para validar tokens
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Email (Nodemailer / SMTP)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_SECURE: String(process.env.SMTP_SECURE || 'false') === 'true',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM || process.env.SMTP_USER
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
