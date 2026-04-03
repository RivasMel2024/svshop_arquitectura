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
    .populate('items.producto', 'nombre precio stock vendedor');

  if (!cart) {
    throw createError('Carrito no encontrado', 404);
  }

  if (cart.items.length === 0) {
    throw createError('El carrito está vacío', 400);
  }

  const datosFacturacion = checkoutData.datosFacturacion || checkoutData["datosFacturación"];
  const { tipoDocumento } = checkoutData;

  // Validar datos requeridos
  if (!tipoDocumento) {
    throw createError('tipoDocumento es requerido', 400);
  }
  if (!datosFacturacion) {
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
    const invoiceItems = cart.items.map((item) => ({
      producto: item.producto._id,
      nombreProducto: item.producto.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.cantidad * item.precioUnitario
    }));

    invoice = await Invoice.create({
      usuario: userId,
      tipoDocumento,
      items: invoiceItems,
      subtotal: subTotal,
      iva: subTotal * IVA,
      total: total,
      datosFacturacion: datosFacturacion
    });
  } catch (error) {
    throw createError(`Error creando invoice: ${error.message}`, 500);
  }

  // 3. Crear orden en microservicio de órdenes
  let order;
  try {
    const orderItems = cart.items.map((item) => ({
      producto: item.producto._id,
      vendedorId: item.producto.vendedor,
      nombreProducto: item.producto.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.cantidad * item.precioUnitario
    }));

    const response = await fetch(`${config.ORDERS_SERVICE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        facturaId: invoice._id.toString(),
        items: orderItems,
        total,
        totales: {
          subtotal: subTotal,
          impuestos: subTotal * IVA,
          costoEnvio: 0,
          descuentos: 0,
          total
        },
        direccionEnvio: {
          calle: datosFacturacion.direccion || 'No especificada',
          ciudad: datosFacturacion.ciudad || 'No especificada',
          departamento: datosFacturacion.departamento || 'No especificado',
          telefono: datosFacturacion.telefono || 'No especificado'
        },
        metodoEnvio: {
          tipo: 'ESTANDAR',
          costo: 0,
          tiempoEstimado: 'N/A'
        }
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
      usuario: order.clienteId || userId,
      invoiceId: order.facturaId || invoice._id,
      estado: order.estado || 'PENDIENTE',
      total: (order.totales && order.totales.total) || total,
      createdAt: order.createdAt
    },
    message: 'Checkout procesado exitosamente'
  };
};

module.exports = {
  processCheckout
};
