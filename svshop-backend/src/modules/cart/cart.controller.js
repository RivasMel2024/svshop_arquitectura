/**
 * Cart Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */

const cartService = require('./cart.service');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const cart = await cartService.getUserCart(userId);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { productId, cantidad } = req.body;

    if (!productId || cantidad === undefined) {
      return res.status(400).json({ message: 'El productId y la cantidad son obligatorios' });
    }

    const cart = await cartService.addProductToCart(userId, productId, cantidad);
    res.status(200).json(cart);
  } catch (error) {
    if (
      error.message.includes('Stock') ||
      error.message.includes('no disponible') ||
      error.message.includes('no encontrado') ||
      error.message.includes('mayor a 0')
    ) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { productId } = req.params;
    const { cantidad } = req.body;

    if (cantidad === undefined) {
      return res.status(400).json({ message: 'La cantidad es obligatoria' });
    }

    const cart = await cartService.updateCartItem(userId, productId, cantidad);
    res.status(200).json(cart);
  } catch (error) {
    if (error.message.includes('Stock')) {
      return res.status(400).json({ message: error.message });
    }
    if (
      error.message.includes('Carrito no encontrado') ||
      error.message.includes('no está en el carrito')
    ) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const { productId } = req.params;

    const cart = await cartService.removeProductFromCart(userId, productId);
    res.status(200).json(cart);
  } catch (error) {
    if (error.message.includes('Carrito no encontrado')) {
      return res.status(404).json({ message: error.message });
    }
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    const cart = await cartService.clearUserCart(userId);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.status(200).json({ message: 'Carrito vaciado correctamente', cart });
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
