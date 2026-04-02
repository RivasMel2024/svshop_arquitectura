/**
 * User Service
 * Responsabilidad: Contiene TODA la lógica de negocio de usuarios
 */

const User = require('./user.model');
const Product = require('../products/product.model');

const getAll = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const users = await User.find()
    .select('-password') // No enviar contraseñas
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });
  
  const total = await User.countDocuments();
  
  return {
    usuarios: users,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / limit)
  };
};

const getById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }
  
  return user;
};

const update = async (userId, updateData, updatedByUserId) => {
  // Campos que no se pueden actualizar directamente
  const forbiddenFields = ['password', 'creadoPor', 'createdAt'];
  forbiddenFields.forEach(field => delete updateData[field]);
  
  const user = await User.findByIdAndUpdate(
    userId,
    {
      ...updateData,
      modificadoPor: updatedByUserId
    },
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }
  
  return user;
};

const remove = async (userId, updatedByUserId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  user.activo = false;
  user.modificadoPor = updatedByUserId;
  await user.save();

  if (user.rol === 'VENDEDOR') {
    await Product.updateMany(
      { vendedor: userId, disponible: true },
      { disponible: false, modificadoPor: updatedByUserId }
    );
  }

  return User.findById(userId).select('-password');
};

module.exports = {
  getAll,
  getById,
  update,
  remove
};
