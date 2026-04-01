/**
 * Orders Service - Microservicio de órdenes
 * Puerto: 3001
 * Base de datos: svshop_orders
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const orderRoutes = require('./modules/orders/order.routes');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas básicas
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'orders-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'SvShop Orders Microservice',
    version: '1.0.0',
  });
});

// Montar rutas de órdenes
app.use('/api/orders', orderRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Orders Service corriendo en puerto ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
});

module.exports = app;
