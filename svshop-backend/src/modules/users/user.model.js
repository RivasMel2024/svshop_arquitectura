/**
 * User Model
 * Define el schema de Mongoose para usuarios
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['CLIENTE', 'VENDEDOR', 'ADMINISTRADOR'],
    default: 'CLIENTE'
  },
  activo: {
    type: Boolean,
    default: true
  },
  failed_login_attempts: {
    type: Number,
    default: 0,
    min: 0
  },
  locked_until: {
    type: Date,
    default: null
  },
  // Auditoría
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  modificadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true // Crea automáticamente createdAt y updatedAt
});

// Índices para optimizar búsquedas
// Nota: email ya tiene unique: true que crea el índice automáticamente
userSchema.index({ rol: 1 });

module.exports = mongoose.model('User', userSchema);
