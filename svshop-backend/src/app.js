/**
 * App.js - Punto de entrada Express
 * Configuración principal del monolito modular
 */

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error.middleware');
const env = require('./config/config');

// Importar rutas de módulos
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const productRoutes = require('./modules/products/product.routes');
const cartRoutes = require('./modules/cart/cart.routes');
const invoiceRoutes = require('./modules/invoices/invoice.routes');
const checkoutRoutes = require('./modules/checkout/checkout.routes');

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Límite técnico; el módulo products valida 3MB de imagen
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'SvShop Backend Monolith',
    timestamp: new Date().toISOString() 
  });
});

// Rutas de módulos
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/checkout', checkoutRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Ruta ${req.method} ${req.url} no encontrada` 
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en puerto ${PORT}`);
  console.log(`✓ Entorno: ${env.NODE_ENV}`);
});

module.exports = app;
