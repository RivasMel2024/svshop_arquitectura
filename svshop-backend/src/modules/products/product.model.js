/**
 * Product Model
 * Define el schema de Mongoose para productos
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  imagen: {
    type: String, // Base64 string
    required: false
  },
  disponible: {
    type: Boolean,
    default: true
  },
  descuento: {
    activo: {
      type: Boolean,
      default: false
    },
    fechaFin: {
      type: Date,
      required: false
    }
  },
  vendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  timestamps: true
});

// Índices para optimizar búsquedas y filtros
productSchema.index({ categoria: 1 });
productSchema.index({ precio: 1 });
productSchema.index({ disponible: 1 });
productSchema.index({ vendedor: 1 });

// Lógica de dominio mínima relacionada con stock
productSchema.methods.hayStockSuficiente = function (cantidadRequerida) {
  return this.stock >= cantidadRequerida;
};

module.exports = mongoose.model('Product', productSchema);
