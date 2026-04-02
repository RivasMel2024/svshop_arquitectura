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

const mapProduct = (product) => ({
  id: product._id || product.id,
  name: product.nombre || product.name,
  description: product.descripcion || product.description || "",
  price: Number(product.precio ?? product.price ?? 0),
  category: product.categoria || product.category || "Sin categoría",
  stock: Number(product.stock ?? 0),
  image: normalizeImage(product.imagen || product.image),
  available: Boolean(product.disponible ?? product.available ?? true),
  sellerId: product.vendedor?._id || product.vendedor || product.sellerId || null,
  sellerName: product.vendedor?.nombre || product.sellerName || ""
})

export const getProducts = async ({ page = 1, limit = 20, disponible, categoria, minPrecio, maxPrecio } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })

  if (disponible !== undefined) {
    params.set("disponible", String(disponible))
  }
  if (categoria) {
    params.set("categoria", categoria)
  }
  if (minPrecio !== undefined) {
    params.set("minPrecio", String(minPrecio))
  }
  if (maxPrecio !== undefined) {
    params.set("maxPrecio", String(maxPrecio))
  }

  const response = await fetch(`${buildApiUrl("/products")}?${params.toString()}`)

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de productos")
  }

  const data = await response.json()
  const products = Array.isArray(data.productos) ? data.productos : []

  return products.map(mapProduct)
}

export const getProductById = async (id) => {
  const response = await fetch(buildApiUrl(`/products/${id}`))

  if (!response.ok) {
    throw new Error("No se pudo obtener el producto")
  }

  const data = await response.json()
  return mapProduct(data)
}

/**
 * Crear un nuevo producto con imagen en base64
 * @param {Object} productData
 * @param {string} productData.nombre - Nombre del producto
 * @param {string} productData.descripcion - Descripción
 * @param {number} productData.precio - Precio
 * @param {string} productData.categoria - Categoría
 * @param {number} productData.stock - Stock disponible
 * @param {string} productData.imagen - Imagen en base64 (opcional)
 * @param {string} token - Token JWT para autenticación
 * @returns {Promise<Object>} Producto creado
 */
export const createProduct = async (productData, token) => {
  if (!token) {
    throw new Error("Token requerido para crear producto")
  }

  const payload = {
    nombre: productData.nombre,
    descripcion: productData.descripcion || "",
    precio: Number(productData.precio),
    categoria: productData.categoria,
    stock: Number(productData.stock) || 0,
    imagen: productData.imagen || null, // Base64 string o null si no hay imagen
    disponible: true
  }

  const response = await fetch(buildApiUrl("/products"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error creando el producto")
  }

  const data = await response.json()
  return mapProduct(data)
}

export const disableProduct = async (productId, token) => {
  if (!token) {
    throw new Error("Token requerido para deshabilitar producto")
  }

  const response = await fetch(buildApiUrl(`/products/${productId}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error deshabilitando el producto")
  }

  return await response.json()
}

export const updateProduct = async (productId, productData, token) => {
  if (!token) {
    throw new Error("Token requerido para actualizar producto")
  }

  const payload = {
    nombre: productData.nombre,
    descripcion: productData.descripcion || "",
    precio: Number(productData.precio),
    categoria: productData.categoria,
    stock: Number(productData.stock) || 0,
  }

  if (productData.imagen) {
    payload.imagen = productData.imagen
  }

  const response = await fetch(buildApiUrl(`/products/${productId}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error actualizando el producto")
  }

  const data = await response.json()
  return mapProduct(data)
}
