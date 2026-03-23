const express = require('express');
const router = express.Router();
const orderController = require('./order.controller')
const { verifyToken } = require('../../middlewares/auth.middleware');


// POST /api/orders -- Crear orden
router.post('/', verifyToken, orderController.createOrder);

// GET /api/orders/id -- Buscar orden por Id
router.get('/:id', verifyToken, orderController.getOrderById);

// GET /api/orders/user/userId -- Buscar ordenes de usuario
router.get('/user/:userId', verifyToken, orderController.getUserOrders);

// PATCH /api/orders/status/id -- Actualizar estado de orden
router.patch('/status/:id', verifyToken, orderController.updateOrderStatus);


module.exports = router;
