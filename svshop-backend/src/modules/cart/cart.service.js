/**
 * Cart Service
 * Responsabilidad: Contiene TODA la lógica de negocio del carrito
 */

const Cart = require('./cart.model');

const getUserCart = async (userId) => {
  // TODO: Obtener o crear carrito del usuario
  throw new Error('Not implemented');
};

const addProductToCart = async (userId, productId, cantidad) => {
  // TODO: Agregar producto al carrito
  // TODO: Validar stock disponible
  throw new Error('Not implemented');
};

const updateCartItem = async (userId, productId, cantidad) => {
  // TODO: Actualizar cantidad de producto
  // TODO: Validar stock disponible
  throw new Error('Not implemented');
};

const removeProductFromCart = async (userId, productId) => {
  // TODO: Eliminar producto del carrito
  throw new Error('Not implemented');
};

const clearUserCart = async (userId) => {
  // TODO: Vaciar carrito completo
  throw new Error('Not implemented');
};

module.exports = {
  getUserCart,
  addProductToCart,
  updateCartItem,
  removeProductFromCart,
  clearUserCart
};
