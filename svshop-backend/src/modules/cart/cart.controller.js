/**
 * Cart Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */

const cartService = require('./cart.service');

const getCart = async (req, res, next) => {
  try {
    // TODO: Obtener carrito del usuario autenticado
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    // TODO: Agregar producto al carrito
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    // TODO: Actualizar cantidad de producto en carrito
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    // TODO: Eliminar producto del carrito
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    // TODO: Vaciar carrito completo
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
};
