/**
 * Auth Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */

const authService = require('./auth.service');

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,72}$/;

const validateRegisterDTO = (payload) => {
  const errors = [];

  const nombre = String(payload.nombre || '').trim();
  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '');

  if (!nombre || nombre.length < 2 || nombre.length > 80) {
    errors.push('El nombre es requerido y debe tener entre 2 y 80 caracteres');
  }

  if (!EMAIL_REGEX.test(email)) {
    errors.push('El email no tiene un formato válido');
  }

  if (!PASSWORD_REGEX.test(password)) {
    errors.push('La contraseña debe tener entre 8 y 72 caracteres e incluir mayúscula, minúscula, número y símbolo');
  }

  return {
    errors,
    data: { nombre, email, password }
  };
};

const validateLoginDTO = (payload) => {
  const errors = [];

  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '');

  if (!EMAIL_REGEX.test(email)) {
    errors.push('El email no tiene un formato válido');
  }

  if (!password) {
    errors.push('La contraseña es requerida');
  }

  return {
    errors,
    data: { email, password }
  };
};

const register = async (req, res, next) => {
  try {
    const { errors, data } = validateRegisterDTO(req.body);

    if (errors.length) {
      throw createError(errors, 400);
    }

    const user = await authService.registerUser(data);

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { errors, data } = validateLoginDTO(req.body);

    if (errors.length) {
      throw createError(errors, 400);
    }

    const result = await authService.loginUser(data.email, data.password);

    res.status(200).json({
      message: 'Login exitoso',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
