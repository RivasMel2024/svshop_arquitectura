/**
 * Database Configuration (Singleton)
 * Conexión a MongoDB usando Mongoose
 */

const mongoose = require('mongoose');
const env = require('./config');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('✓ MongoDB ya está conectado (Singleton)');
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI)

    isConnected = true;
    console.log(`✓ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('✗ Error al conectar a MongoDB:', error.message);
    process.exit(1); // Finalizar proceso si no se puede conectar
  }
};

module.exports = connectDB;
