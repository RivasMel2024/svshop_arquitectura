import { buildApiUrl } from "./api.config"

/**
 * Crea una nueva orden con los datos del carrito y envío
 * @param {Object} params
 * @param {string} params.token - Token JWT del usuario
 * @param {string} params.tipoDocumento - CONSUMIDOR_FINAL | CREDITO_FISCAL
 * @param {Object} params.datosFacturacion - Datos de facturacion segun tipoDocumento
 * @returns {Promise<Object>} Orden creada
 */
export const createOrder = async ({
  token = "",
  tipoDocumento = "CONSUMIDOR_FINAL",
  datosFacturacion = {}
}) => {
  if (!token) {
    throw new Error("Token de autenticación requerido")
  }
  const orderPayload = {
    tipoDocumento,
    datosFacturacion
  }

  const response = await fetch(buildApiUrl("/checkout"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderPayload),
  })

  const raw = await response.text()
  const safeJson = (() => {
    try {
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })()

  if (!response.ok) {
    throw new Error(safeJson.message || `Error creando la orden (${response.status})`)
  }

  return safeJson
}
