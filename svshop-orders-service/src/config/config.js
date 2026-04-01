/**
 * Configuration - Orders Microservice
 * Carga variables de entorno del archivo .env
 */

const dotenv = require('dotenv');
const path = require('path');

// Cargar primero .env base para detectar NODE_ENV si existe ahi
dotenv.config();

const environment = process.env.NODE_ENV || 'development';

// En desarrollo cargar .env.development (Mongo local), en producción .env
const envFile = environment === 'development' ? '.env.development' : '.env';
const envPath = path.resolve(__dirname, '../../', envFile);
dotenv.config({ path: envPath, override: true });

const normalizeEnvValue = (value) => String(value || '').trim();
const normalizeSmtpPassword = (value) => normalizeEnvValue(value).replace(/[\s\u00A0]+/g, '');
const resolveSmtpFrom = () => {
  const rawFrom = normalizeEnvValue(process.env.SMTP_FROM);
  const smtpUser = normalizeEnvValue(process.env.SMTP_USER);

  if (!rawFrom) {
    return smtpUser;
  }

  // Evita usar remitentes de ejemplo que Gmail suele rechazar
  if (rawFrom.includes('correo@dominio.com')) {
    return smtpUser;
  }

  return rawFrom;
};

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  
  // MongoDB
  MONGO_URI: process.env.MONGO_URI,
  
  // JWT - DEBE COINCIDIR con el del backend monolito para validar tokens
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Email (Nodemailer / SMTP)
  SMTP_HOST: normalizeEnvValue(process.env.SMTP_HOST),
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_SECURE: String(process.env.SMTP_SECURE || 'false') === 'true',
  SMTP_USER: normalizeEnvValue(process.env.SMTP_USER),
  SMTP_PASS: normalizeSmtpPassword(process.env.SMTP_PASS),
  SMTP_FROM: resolveSmtpFrom(),

  // Integración con backend monolito para actualizar stock
  MONOLITH_API_URL: process.env.MONOLITH_API_URL || 'http://localhost:8080',
  INTERNAL_API_KEY: process.env.INTERNAL_API_KEY
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
