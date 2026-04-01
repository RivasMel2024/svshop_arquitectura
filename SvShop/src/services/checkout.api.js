const buildOrdersUrl = (path) => {
  const raw = (import.meta.env.VITE_ORDERS_API_URL || "http://localhost:3001").trim()
  const normalizedBaseUrl = raw.replace(/\/+$/, "")
  const baseWithoutApi = normalizedBaseUrl.endsWith("/api")
    ? normalizedBaseUrl.slice(0, -4)
    : normalizedBaseUrl
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${baseWithoutApi}/api${normalizedPath}`
}

/**
 * Crea una nueva orden con los datos del carrito y envío
 * @param {Object} params
 * @param {Array} params.cartItems - Items del carrito con id, name, price, vendedorId, quantity
 * @param {number} params.total - Total de la orden
 * @param {number} params.subtotal - Subtotal sin envío
 * @param {string} params.token - Token JWT del usuario
 * @param {Object} params.shippingData - { nombre, apellidos, direccion, ciudad, codigoPostal }
 * @returns {Promise<Object>} Orden creada
 */
export const createOrder = async ({
  cartItems = [],
  total = 0,
  subtotal = 0,
  token = "",
  shippingData = {}
}) => {
  if (!token) {
    throw new Error("Token de autenticación requerido")
  }

  if (!cartItems.length) {
    throw new Error("El carrito no puede estar vacío")
  }

  if (!total || total <= 0) {
    throw new Error("Total inválido")
  }

  // Validar estructura mínima de items
  const invalidItem = cartItems.find((item) => !item?.id || !(item?.sellerId || item?.vendedorId))
  if (invalidItem) {
    throw new Error("Hay productos sin vendedor asignado o sin ID válido")
  }

  // Mapear items del carrito a la estructura que espera el backend
  const items = cartItems.map((item) => ({
    nombreProducto: item.name,
    cantidad: item.quantity,
    precioUnitario: item.price,
    subtotal: item.price * item.quantity,
    producto: item.id,
    vendedorId: item.sellerId || item.vendedorId,
  }))

  const orderPayload = {
    items,
    total: parseFloat(total),
    subtotal: parseFloat(subtotal),
    direccionEnvio: {
      calle: shippingData.direccion || "",
      ciudad: shippingData.ciudad || "",
      departamento: shippingData.apellidos || "",
      telefono: shippingData.telefono || "",
    },
    metodoEnvio: {
      tipo: "Estándar",
      costo: total - subtotal, // El costo de envío es la diferencia
      tiempoEstimado: "3-5 días hábiles",
    },
    totales: {
      subtotal: parseFloat(subtotal),
      descuentos: 0,
      impuestos: 0,
      costoEnvio: parseFloat(total - subtotal),
      total: parseFloat(total),
    },
  }

  const response = await fetch(buildOrdersUrl("/orders"), {
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
