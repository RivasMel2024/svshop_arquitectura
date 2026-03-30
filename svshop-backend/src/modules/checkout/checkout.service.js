/**
 * Checkout Service
 * Responsabilidad: Contiene TODA la lógica de negocio del checkout
 * Flujo: validar carrito → crear invoice → crear orden en microservicio → vaciar carrito
 */

const Cart = require('../cart/cart.model');
const Invoice = require('../invoices/invoice.model');
const config = require('../../config/config');

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Procesar checkout: crear invoice y orden
 * @param {string} userId - ID del usuario autenticado
 * @param {object} checkoutData - { tipoDocumento, datosFacturación }
 * @param {string} token - JWT token del usuario para validar en microservicio
 * @returns {object} { invoice, order }
 */
const processCheckout = async (userId, checkoutData, token) => {
  // 1. Obtener carrito del usuario
  const cart = await Cart.findOne({ usuario: userId })
    .populate('items.producto', 'nombre precio stock');

  if (!cart) {
    throw createError('Carrito no encontrado', 404);
  }

  if (cart.items.length === 0) {
    throw createError('El carrito está vacío', 400);
  }

  const { tipoDocumento, datosFacturación } = checkoutData;

  // Validar datos requeridos
  if (!tipoDocumento) {
    throw createError('tipoDocumento es requerido', 400);
  }
  if (!datosFacturación) {
    throw createError('datosFacturación es requerido', 400);
  }

  // 2. Crear invoice localmente
  const subTotal = cart.items.reduce((sum, item) => {
    return sum + (item.cantidad * item.precioUnitario);
  }, 0);

  const IVA = 0.13;
  const total = subTotal * (1 + IVA);

  let invoice;
  try {
    invoice = await Invoice.create({
      usuario: userId,
      tipoDocumento,
      items: cart.items.map(item => ({
        producto: item.producto._id,
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio: item.precioUnitario
      })),
      subtotal: subTotal,
      iva: subTotal * IVA,
      total: total,
      datosFacturación
    });
  } catch (error) {
    throw createError(`Error creando invoice: ${error.message}`, 500);
  }

  // 3. Crear orden en microservicio de órdenes
  let order;
  try {
    const response = await fetch(`${config.ORDERS_SERVICE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        usuario: userId,
        invoiceId: invoice._id.toString(),
        items: cart.items.map(item => ({
          producto: item.producto._id,
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: item.precioUnitario
        })),
        subtotal: subTotal,
        iva: subTotal * IVA,
        total: total,
        datosFacturación
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw createError(
        `Error creando orden en microservicio: ${errorData.message || response.statusText}`,
        response.status
      );
    }

    order = await response.json();
  } catch (error) {
    // Si falla crear la orden, eliminar la invoice creada
    await Invoice.findByIdAndDelete(invoice._id);
    throw error;
  }

  // 4. Vaciar el carrito del usuario
  try {
    await cart.vaciarCarrito();
  } catch (error) {
    console.error('⚠️ Error vaciando carrito:', error);
    // No fallar checkout si hay error vaciando carrito, pero registrarlo
  }

  // 5. Retornar invoice + order
  return {
    success: true,
    invoice: {
      _id: invoice._id,
      usuario: invoice.usuario,
      tipoDocumento: invoice.tipoDocumento,
      subtotal: invoice.subtotal,
      iva: invoice.iva,
      total: invoice.total,
      createdAt: invoice.createdAt
    },
    order: {
      _id: order._id || order.id,
      usuario: order.usuario,
      invoiceId: order.invoiceId,
      estado: order.estado || 'CREADA',
      total: order.total,
      createdAt: order.createdAt
    },
    message: 'Checkout procesado exitosamente'
  };
};

module.exports = {
  processCheckout
};
