import { buildApiUrl } from "./api.config"

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&w=800&q=60"

const normalizeImage = (value) => {
  if (!value) return PLACEHOLDER_IMAGE
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
    return value
  }
  return `data:image/jpeg;base64,${value}`
}

const mapCartItem = (item) => {
  const product = item?.producto || {}

  return {
    id: product._id || product.id || item.producto || item.productId,
    name: product.nombre || product.name || "Producto",
    price: Number(item?.precioUnitario ?? product.precio ?? 0),
    quantity: Number(item?.cantidad ?? 0),
    image: normalizeImage(product.imagen || product.image),
    sellerId: product.vendedor?._id || product.vendedor || null,
    available: Boolean(product.disponible ?? true)
  }
}

const mapCartResponse = (cart) => {
  const items = Array.isArray(cart?.items) ? cart.items : []
  return items.map(mapCartItem)
}

export const getCart = async (token) => {
  if (!token) {
    throw new Error("Token requerido para obtener carrito")
  }

  const response = await fetch(buildApiUrl("/cart"), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo obtener el carrito")
  }

  return mapCartResponse(data)
}

export const addCartItem = async ({ productId, cantidad }, token) => {
  if (!token) {
    throw new Error("Token requerido para agregar al carrito")
  }

  const response = await fetch(buildApiUrl("/cart/items"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId, cantidad })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo agregar al carrito")
  }

  return mapCartResponse(data)
}

export const updateCartItem = async ({ productId, cantidad }, token) => {
  if (!token) {
    throw new Error("Token requerido para actualizar el carrito")
  }

  const response = await fetch(buildApiUrl(`/cart/items/${productId}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ cantidad })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo actualizar el carrito")
  }

  return mapCartResponse(data)
}

export const removeCartItem = async ({ productId }, token) => {
  if (!token) {
    throw new Error("Token requerido para eliminar del carrito")
  }

  const response = await fetch(buildApiUrl(`/cart/items/${productId}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo eliminar del carrito")
  }

  return mapCartResponse(data)
}

export const clearCart = async (token) => {
  if (!token) {
    throw new Error("Token requerido para limpiar el carrito")
  }

  const response = await fetch(buildApiUrl("/cart"), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo vaciar el carrito")
  }

  return mapCartResponse(data.cart || {})
}
