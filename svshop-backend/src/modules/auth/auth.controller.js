/**
 * Auth Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */

const authService = require('./auth.service');

const register = async (req, res, next) => {
  try {
    // TODO: Implementar registro de usuario
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // TODO: Implementar login de usuario
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
