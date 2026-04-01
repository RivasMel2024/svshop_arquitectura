/**
 * Product Routes
 * Define las rutas Express para productos
 */

const express = require('express');
const router = express.Router();
const productController = require('./product.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');
const { checkRole } = require('../../middlewares/role.middleware');

// GET /api/products - Listar productos (público con filtros)
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Obtener producto por ID (público)
router.get('/:id', productController.getProductById);

// POST /api/products - Crear producto (solo vendedor)
router.post('/', verifyToken, checkRole(['VENDEDOR']), productController.createProduct);

// PUT /api/products/:id - Actualizar producto (solo vendedor y admin)
router.put('/:id', verifyToken, checkRole(['VENDEDOR', 'ADMINISTRADOR']), productController.updateProduct);

// DELETE /api/products/:id - Deshabilitar producto (vendedor/admin, vendedor solo los suyos)
router.delete('/:id', verifyToken, checkRole(['VENDEDOR', 'ADMINISTRADOR']), productController.deleteProduct);

module.exports = router;
