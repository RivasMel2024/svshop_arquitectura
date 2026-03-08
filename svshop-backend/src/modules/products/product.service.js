/**
 * Product Service
 * Responsabilidad: Contiene TODA la lógica de negocio de productos
 */

const Product = require('./product.model');

const getAll = async (filters = {}, page = 1, limit = 10) => {
  // TODO: Implementar filtros por categoría, precio, disponibilidad
  // TODO: Implementar paginación (10 o 20 registros)
  throw new Error('Not implemented');
};

const getById = async (productId) => {
  // TODO: Implementar búsqueda por ID
  throw new Error('Not implemented');
};

const create = async (productData) => {
  // TODO: Validar imagen base64 (límite 3MB)
  // TODO: Implementar creación con auditoría
  throw new Error('Not implemented');
};

const update = async (productId, updateData) => {
  // TODO: Implementar actualización con auditoría
  throw new Error('Not implemented');
};

const remove = async (productId) => {
  // TODO: Implementar eliminación
  throw new Error('Not implemented');
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
