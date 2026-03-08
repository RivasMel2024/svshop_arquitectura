/**
 * User Routes
 * Define las rutas Express para usuarios
 */

const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { verifyToken } = require('../../middlewares/auth.middleware');
const { checkRole } = require('../../middlewares/role.middleware');

// GET /api/users - Listar usuarios (solo admin)
router.get('/', verifyToken, checkRole(['ADMINISTRADOR']), userController.getAllUsers);

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', verifyToken, userController.getUserById);

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', verifyToken, userController.updateUser);

// DELETE /api/users/:id - Eliminar usuario (solo admin)
router.delete('/:id', verifyToken, checkRole(['ADMINISTRADOR']), userController.deleteUser);

module.exports = router;
