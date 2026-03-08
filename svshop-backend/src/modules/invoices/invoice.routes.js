/**
 * Invoice Routes
 * Define las rutas Express para facturas
 */

const express = require('express');
const router = express.Router();
const invoiceController = require('./invoice.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');

// Todas las rutas de facturas requieren autenticación

// POST /api/invoices - Crear factura (desde checkout)
router.post('/', verifyToken, invoiceController.createInvoice);

// GET /api/invoices/:id - Obtener factura por ID
router.get('/:id', verifyToken, invoiceController.getInvoiceById);

// GET /api/invoices/user/:userId - Obtener facturas del usuario
router.get('/user/:userId', verifyToken, invoiceController.getUserInvoices);

module.exports = router;
