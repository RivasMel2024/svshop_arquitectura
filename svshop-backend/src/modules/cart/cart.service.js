/**
 * Cart Service
 * Responsabilidad: Contiene TODA la lógica de negocio del carrito
 */

const Cart = require('./cart.model');
const Product = require('../products/product.model');

const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ usuario: userId })
    .populate('items.producto', 'nombre imagen precio disponible vendedor')
    .exec();

  if (!cart) {
    cart = await Cart.create({ usuario: userId, items: [], total: 0 });
  }

  await cart.populate('items.producto', 'nombre imagen precio disponible vendedor');
  return cart;
};

const addProductToCart = async (userId, productId, cantidad) => {
  const parsedCantidad = Number(cantidad);
  if (!parsedCantidad || parsedCantidad <= 0) {
    throw new Error('La cantidad debe ser mayor a 0');
  }

  const product = await Product.findById(productId);

  if (!product || !product.disponible) {
    throw new Error('Producto no encontrado o no disponible');
  }

  let cart = await Cart.findOne({ usuario: userId });
  if (!cart) {
    cart = new Cart({ usuario: userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.producto.toString() === productId
  );

  if (itemIndex > -1) {
    const nuevaCantidad = cart.items[itemIndex].cantidad + parsedCantidad;

    if (!product.hayStockSuficiente(nuevaCantidad)) {
      throw new Error(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
    }

    cart.items[itemIndex].cantidad = nuevaCantidad;
    cart.items[itemIndex].precioUnitario = product.precio;
  } else {
    if (!product.hayStockSuficiente(parsedCantidad)) {
      throw new Error(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
    }

    cart.items.push({
      producto: productId,
      cantidad: parsedCantidad,
      precioUnitario: product.precio
    });
  }

  await cart.save();
  await cart.populate('items.producto', 'nombre imagen precio disponible vendedor');
  return cart;
};

const updateCartItem = async (userId, productId, cantidad) => {
  const parsedCantidad = Number(cantidad);
  const cart = await Cart.findOne({ usuario: userId });

  if (!cart) {
    throw new Error('Carrito no encontrado');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.producto.toString() === productId
  );

  if (itemIndex === -1) {
    throw new Error('El producto no está en el carrito');
  }

  if (!parsedCantidad || parsedCantidad <= 0) {
    return removeProductFromCart(userId, productId);
  }

  const product = await Product.findById(productId);
  if (!product || !product.disponible) {
    throw new Error('Producto no encontrado o no disponible');
  }

  if (!product.hayStockSuficiente(parsedCantidad)) {
    throw new Error(`Stock insuficiente. Solo hay ${product.stock} unidades disponibles.`);
  }

  cart.items[itemIndex].cantidad = parsedCantidad;
  cart.items[itemIndex].precioUnitario = product.precio;

  await cart.save();
  await cart.populate('items.producto', 'nombre imagen precio disponible vendedor');
  return cart;
};

const removeProductFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ usuario: userId });

  if (!cart) {
    throw new Error('Carrito no encontrado');
  }

  cart.items = cart.items.filter(
    (item) => item.producto.toString() !== productId
  );

  await cart.save();
  await cart.populate('items.producto', 'nombre imagen precio disponible vendedor');
  return cart;
};

const clearUserCart = async (userId) => {
  const cart = await Cart.findOne({ usuario: userId });

  if (!cart) {
    return null;
  }

  await cart.vaciarCarrito();
  return cart;
};

module.exports = {
  getUserCart,
  addProductToCart,
  updateCartItem,
  removeProductFromCart,
  clearUserCart
};
