/**
 * Invoice Model
 * Define el schema de Mongoose para facturas
 */

const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  nombreProducto: String,
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipoDocumento: {
    type: String,
    enum: ['CONSUMIDOR_FINAL', 'CREDITO_FISCAL'],
    required: true
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  iva: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  // Información adicional según tipo de documento
  datosFacturacion: {
    nombre: String,
    nit: String,
    direccion: String,
    telefono: String
  },
  estado: {
    type: String,
    enum: ['PAGADA', 'PENDIENTE', 'CANCELADA'],
    default: 'PENDIENTE'
  }
}, {
  timestamps: true
});

// Índices para búsquedas y reportes
invoiceSchema.index({ usuario: 1 });
invoiceSchema.index({ estado: 1 });
invoiceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
