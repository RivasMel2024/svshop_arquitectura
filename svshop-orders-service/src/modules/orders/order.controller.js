const orderService = require('./order.service');
const { sendCheckoutConfirmationEmail } = require('./order.email');


//Crea una orden nueva
const createOrder = async (req, res) => {
  try {
    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { items, total, subtotal } = req.body;

    // Validar entrada
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'items debe ser un array no vacío' });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ message: 'total es requerido y debe ser > 0' });
    }

    // Agregar clienteId del usuario autenticado
    const orderData = {
      ...req.body,
      clienteId: req.user.id,
      numeroOrden: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    const order = await orderService.create(orderData);

    try {
      await sendCheckoutConfirmationEmail({
        to: req.user.email,
        order,
      });
    } catch (emailError) {
      // No bloquear checkout por fallo SMTP
      console.warn('No se pudo enviar correo de confirmacion:', emailError.message);
    }

    res.status(201).json(order);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
};


//Busca una orden usando Id
const getOrderById = async (req, res) => {
  try {
    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID de orden es requerido' });
    }

    const order = await orderService.getById(id);

    // Validar que el usuario autenticado sea el propietario de la orden
    if (order.clienteId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta orden' });
    }

    res.status(200).json(order);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
};

//Busca ordenes de un usuario
const getUserOrders = async (req, res) => {
  try {
    // Validar que el usuario esté autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validar que el usuario autenticado solo vea sus propias órdenes
    if (userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para acceder órdenes de otro usuario' });
    }

    const result = await orderService.getByUser(userId, Number(page), Number(limit));

    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
};

// Busca órdenes de un vendedor
const getSellerOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { sellerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (sellerId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para acceder órdenes de otro vendedor' });
    }

    const result = await orderService.getBySeller(sellerId, Number(page), Number(limit));

    res.status(200).json(result);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
};

//actualiza estado de una orden
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newState, comment } = req.body;

    // Validar entrada
    if (!id) {
      return res.status(400).json({ message: 'ID de orden es requerido' });
    }
    if (!newState) {
      return res.status(400).json({ message: 'newState es requerido' });
    }

    const order = await orderService.getById(id);

    if (!order.items || order.items.length === 0) {
      return res.status(400).json({ message: 'La orden no tiene items para validar vendedor propietario' });
    }

    const sellerOwnsAllItems = order.items.every(
      (item) => item.vendedorId && item.vendedorId.toString() === req.user.id
    );

    if (!sellerOwnsAllItems) {
      return res.status(403).json({ message: 'Solo el vendedor propietario de los productos puede actualizar esta orden' });
    }

    const state = await orderService.updateOrderStatus(id, newState, comment);
    res.status(200).json(state);
  } catch (error) {
    const statusCode = error.statusCode || 400;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus

};

