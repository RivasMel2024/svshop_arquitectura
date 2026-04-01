/**
 * Checkout Routes
 * Rutas placeholder para evitar errores al montar el módulo.
 * La lógica real de checkout la implementará el responsable del módulo.
 */

const express = require('express');
const checkoutController = require('./checkout.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');
const router = express.Router();

// POST /api/checkout - Procesar checkout y crear orden
router.post('/', verifyToken, checkoutController.processCheckout);

module.exports = router;

