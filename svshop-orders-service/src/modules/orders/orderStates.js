//Este archivo facilita la validación de cambio de estados

const VALID_TRANSITIONS = {
  PENDIENTE: ["EN_CAMINO", "CANCELADA"],
  EN_CAMINO: ["RECIBIDA", "CANCELADA"],
  RECIBIDA: [],
  CANCELADA: []
};

module.exports = {
    VALID_TRANSITIONS
}

