/**
 * User Service
 * Responsabilidad: Contiene TODA la lógica de negocio de usuarios
 */

const User = require('./user.model');

const getAll = async (page = 1, limit = 10) => {
  // TODO: Implementar paginación (10 o 20 registros)
  throw new Error('Not implemented');
};

const getById = async (userId) => {
  // TODO: Implementar búsqueda por ID
  throw new Error('Not implemented');
};

const update = async (userId, updateData) => {
  // TODO: Implementar actualización con auditoría
  throw new Error('Not implemented');
};

const remove = async (userId) => {
  // TODO: Implementar eliminación (soft delete recomendado)
  throw new Error('Not implemented');
};

module.exports = {
  getAll,
  getById,
  update,
  remove
};
