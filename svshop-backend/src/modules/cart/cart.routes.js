/**
 * Cart Routes
 * Define las rutas Express para carrito de compras
 */

const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

// Todas las rutas de carrito requieren autenticación

// GET /api/cart - Obtener carrito del usuario
router.get('/', verifyToken, cartController.getCart);

// POST /api/cart/items - Agregar producto al carrito
router.post('/items', verifyToken, cartController.addItem);

// PUT /api/cart/items/:productId - Actualizar cantidad de producto
router.put('/items/:productId', verifyToken, cartController.updateItem);

// DELETE /api/cart/items/:productId - Eliminar producto del carrito
router.delete('/items/:productId', verifyToken, cartController.removeItem);

// DELETE /api/cart - Vaciar carrito
router.delete('/', verifyToken, cartController.clearCart);

module.exports = router;
