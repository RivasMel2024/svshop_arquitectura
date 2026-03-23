/**
 * Auth Service
 * Responsabilidad: Contiene TODA la lógica de negocio de autenticación
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const User = require('../users/user.model');

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeEmail = (email) => String(email || '').toLowerCase().trim();

const buildSafeUser = (user) => ({
  id: user._id,
  nombre: user.nombre,
  email: user.email,
  rol: user.rol,
  activo: user.activo,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const registerUser = async (userData) => {
  const nombre = String(userData.nombre || '').trim();
  const email = normalizeEmail(userData.email);
  const plainPassword = String(userData.password || '');

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError('El email ya está registrado', 400);
  }

  const hashedPassword = await bcrypt.hash(plainPassword, config.BCRYPT_SALT_ROUNDS);

  const user = await User.create({
    nombre,
    email,
    password: hashedPassword,
    rol: 'CLIENTE',
    activo: true
  });

  return buildSafeUser(user);
};

const loginUser = async (email, password) => {
  const normalizedEmail = normalizeEmail(email);
  const plainPassword = String(password || '');

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    throw createError('Credenciales inválidas', 401);
  }

  if (!user.activo) {
    throw createError('Usuario inactivo', 403);
  }

  const now = new Date();

  if (user.locked_until && user.locked_until > now) {
    throw createError('Usuario bloqueado temporalmente por intentos fallidos', 423);
  }

  if (user.locked_until && user.locked_until <= now) {
    user.locked_until = null;
    user.failed_login_attempts = 0;
  }

  const isPasswordValid = await bcrypt.compare(plainPassword, user.password);

  if (!isPasswordValid) {
    user.failed_login_attempts = (user.failed_login_attempts || 0) + 1;

    if (user.failed_login_attempts >= config.LOGIN_MAX_ATTEMPTS) {
      user.failed_login_attempts = 0;
      user.locked_until = new Date(now.getTime() + (config.LOGIN_LOCK_MINUTES * 60 * 1000));
      await user.save();
      throw createError('Usuario bloqueado temporalmente por intentos fallidos', 423);
    }

    await user.save();
    throw createError('Credenciales inválidas', 401);
  }

  user.failed_login_attempts = 0;
  user.locked_until = null;
  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      rol: user.rol
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: buildSafeUser(user)
  };
};

module.exports = {
  registerUser,
  loginUser
};
