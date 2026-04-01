const express = require('express');
const router = express.Router();
const orderController = require('./order.controller')
const { verifyToken } = require('../../middleware/auth.middleware');
const { checkRole } = require('../../middleware/role.middleware');


// POST /api/orders -- Crear orden
router.post('/', verifyToken, orderController.createOrder);

// GET /api/orders/id -- Buscar orden por Id
router.get('/:id', verifyToken, orderController.getOrderById);

// GET /api/orders/user/userId -- Buscar ordenes de usuario
router.get('/user/:userId', verifyToken, orderController.getUserOrders);

// GET /api/orders/seller/sellerId -- Buscar ordenes de vendedor
router.get('/seller/:sellerId', verifyToken, checkRole(['VENDEDOR']), orderController.getSellerOrders);

// PATCH /api/orders/status/id -- Actualizar estado de orden
router.patch('/status/:id', verifyToken, checkRole(['VENDEDOR']), orderController.updateOrderStatus);


module.exports = router;
