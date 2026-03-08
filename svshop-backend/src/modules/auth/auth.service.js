/**
 * Auth Service
 * Responsabilidad: Contiene TODA la lógica de negocio de autenticación
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
  // TODO: Implementar lógica de registro
  throw new Error('Not implemented');
};

const loginUser = async (email, password) => {
  // TODO: Implementar lógica de login y generación de JWT
  throw new Error('Not implemented');
};

module.exports = {
  registerUser,
  loginUser
};
