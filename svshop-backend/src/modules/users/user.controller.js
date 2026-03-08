/**
 * User Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */

const userService = require('./user.service');

const getAllUsers = async (req, res, next) => {
  try {
    // TODO: Implementar listado de usuarios con paginación
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    // TODO: Implementar obtención de usuario por ID
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    // TODO: Implementar actualización de usuario
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    // TODO: Implementar eliminación de usuario
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
