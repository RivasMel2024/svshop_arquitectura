const mongoose = require("mongoose");
const { Schema } = mongoose;

const direccionEnvioSchema = new Schema(
  {
    calle: { type: String, required: true },
    ciudad: { type: String, required: true },
    departamento: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  vendedorId: {
    type: mongoose.Schema.Types.ObjectId,
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

const metodoEnvioSchema = new Schema(
  {
    tipo: { type: String, required: true },
    costo: { type: Number, required: true },
    tiempoEstimado: { type: String },
  },
  { _id: false }
);

const totalesSchema = new Schema(
  {
    subtotal: { type: Number, required: true },
    descuentos: { type: Number, default: 0 },
    impuestos: { type: Number, default: 0 },
    costoEnvio: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const cuponAplicadoSchema = new Schema(
  {
    codigo: { type: String },
    descuento: { type: Number },
  },
  { _id: false }
);

const historialEstadoSchema = new Schema(
  {
    estado: {
      type: String,
      enum: ["PENDIENTE", "EN_CAMINO", "RECIBIDA", "CANCELADA"],
      required: true,
    },
    fecha: { type: Date, default: Date.now },
    comentario: { type: String },
  },
  { _id: false }
);

const estadoVendedorSchema = new Schema(
  {
    vendedorId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    estado: {
      type: String,
      enum: ["PENDIENTE", "EN_CAMINO", "RECIBIDA", "CANCELADA"],
      required: true,
      default: "PENDIENTE",
    },
    historial: [historialEstadoSchema],
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    numeroOrden: {
      type: String,
      unique: true,
      required: true,
    },

    clienteId: {
      type: Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },

    items: [orderItemSchema],

    direccionEnvio: direccionEnvioSchema,

    metodoEnvio: metodoEnvioSchema,

    totales: totalesSchema,

    cuponAplicado: cuponAplicadoSchema,

    estado: {
      type: String,
      enum: ["PENDIENTE", "EN_CAMINO", "RECIBIDA", "CANCELADA"],
      default: "PENDIENTE",
    },

    estadosVendedor: [estadoVendedorSchema],

    historialEstados: [historialEstadoSchema],

    facturaId: {
      type: Schema.Types.ObjectId,
      ref: "Factura",
    },

    numeroSeguimiento: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);