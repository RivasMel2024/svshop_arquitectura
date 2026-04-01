/**
 * Cart Model
 * Define el schema de Mongoose para carritos de compra
 */

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Índice para búsquedas rápidas por usuario
// Nota: usuario ya tiene unique: true que crea el índice automáticamente

// Calcular total automáticamente antes de guardar
cartSchema.pre('save', function (next) {
  this.total = this.items.reduce((acc, item) => {
    return acc + (item.cantidad * item.precioUnitario);
  }, 0);
  next();
});

// Método de instancia para vaciar carrito (se usará desde checkout)
cartSchema.methods.vaciarCarrito = async function () {
  this.items = [];
  this.total = 0;
  return this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
