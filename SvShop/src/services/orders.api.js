const getOrdersBaseUrl = () => {
  const raw = (import.meta.env.VITE_ORDERS_API_URL || "http://localhost:3001").trim()
  const withoutTrailingSlash = raw.replace(/\/+$/, "")
  return withoutTrailingSlash.endsWith("/api")
    ? withoutTrailingSlash.slice(0, -4)
    : withoutTrailingSlash
}

const buildOrdersUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${getOrdersBaseUrl()}/api${normalizedPath}`
}

export const getOrdersByUser = async ({ userId, token, page = 1, limit = 10 }) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })

  const response = await fetch(
    `${buildOrdersUrl(`/orders/user/${userId}`)}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo obtener el historial de pedidos")
  }

  return data
}

export const getOrdersBySeller = async ({ sellerId, token, page = 1, limit = 10 }) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })

  const response = await fetch(
    `${buildOrdersUrl(`/orders/seller/${sellerId}`)}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo obtener órdenes del vendedor")
  }

  return data
}

export const updateOrderStatus = async ({ orderId, token, newState, comment = "" }) => {
  const response = await fetch(buildOrdersUrl(`/orders/status/${orderId}`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ newState, comment })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar el estado de la orden")
  }

  return data
}
