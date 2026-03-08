/**
 * Invoice Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */

const invoiceService = require('./invoice.service');

const createInvoice = async (req, res, next) => {
  try {
    // TODO: Crear factura a partir del checkout
    // TODO: Validar tipo de documento (CONSUMIDOR_FINAL o CREDITO_FISCAL)
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    // TODO: Obtener factura por ID
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const getUserInvoices = async (req, res, next) => {
  try {
    // TODO: Obtener facturas del usuario con paginación
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoiceById,
  getUserInvoices
};
