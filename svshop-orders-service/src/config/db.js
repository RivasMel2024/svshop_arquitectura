/**
 * MongoDB Connection - Orders Service
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error('MONGO_URI no está definido en las variables de entorno');
    }

    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB conectado exitosamente (orders-service)');
    console.log(`📦 Base de datos: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

// Manejo de eventos de conexión
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error en la conexión de MongoDB:', err);
});

module.exports = connectDB;
