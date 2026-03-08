/**
 * Invoice Service
 * Responsabilidad: Contiene TODA la lógica de negocio de facturación
 */

const Invoice = require('./invoice.model');

const create = async (invoiceData) => {
  // TODO: Generar JSON de factura según tipo de documento
  // TODO: Validar que precio en carrito coincida con precio en factura (0% discrepancia)
  throw new Error('Not implemented');
};

const getById = async (invoiceId) => {
  // TODO: Obtener factura por ID
  throw new Error('Not implemented');
};

const getByUser = async (userId, page = 1, limit = 10) => {
  // TODO: Obtener facturas del usuario con paginación
  throw new Error('Not implemented');
};

module.exports = {
  create,
  getById,
  getByUser
};
