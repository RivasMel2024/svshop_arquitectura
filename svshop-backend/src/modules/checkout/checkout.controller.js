/**
 * Checkout Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */

const checkoutService = require('./checkout.service');

/**
 * POST /api/checkout
 * Procesar checkout: crear invoice + crear orden en microservicio
 * Requiere: autenticación JWT
 */
const processCheckout = async (req, res) => {
  try {
    // req.user viene del middleware de autenticación
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const userId = req.user.id;
    const { tipoDocumento, datosFacturación, datosFacturacion } = req.body;
    const billingData = datosFacturación || datosFacturacion;

    // Validar entrada
    if (!tipoDocumento) {
      return res.status(400).json({ message: 'tipoDocumento es requerido' });
    }
    if (!billingData) {
      return res.status(400).json({ message: 'datosFacturación es requerido' });
    }

    // Extraer el token del header Authorization para pasarlo al microservicio
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
    const token = authHeader.substring(7); // Remover 'Bearer '

    // Procesar checkout
    const result = await checkoutService.processCheckout(
      userId,
      { tipoDocumento, datosFacturacion: billingData },
      token
    );

    res.status(201).json(result);
  } catch (error) {
    console.error('Checkout error:', error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message: error.message });
  }
};

module.exports = {
  processCheckout
};
