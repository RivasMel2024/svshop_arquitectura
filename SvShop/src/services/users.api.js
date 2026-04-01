import { buildApiUrl } from "./api.config"

const mapUser = (user) => ({
  id: user._id || user.id,
  name: user.nombre || user.name,
  email: user.email,
  role: user.rol || user.role || "CLIENTE",
  active: Boolean(user.activo ?? user.active ?? true),
  createdAt: user.createdAt
})

/**
 * Obtener lista de todos los usuarios (solo ADMINISTRADOR)
 * @param {string} token - Token JWT
 * @param {Object} options - { page, limit }
 * @returns {Promise<Array>} Lista de usuarios
 */
export const getAllUsers = async (token, { page = 1, limit = 20 } = {}) => {
  if (!token) {
    throw new Error("Token requerido para obtener usuarios")
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  })

  const response = await fetch(`${buildApiUrl("/users")}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error obteniendo usuarios")
  }

  const data = await response.json()
  const users = Array.isArray(data.usuarios) ? data.usuarios : Array.isArray(data) ? data : []

  return users.map(mapUser)
}

/**
 * Obtener un usuario por ID
 * @param {string} userId - ID del usuario
 * @param {string} token - Token JWT
 * @returns {Promise<Object>} Usuario
 */
export const getUserById = async (userId, token) => {
  if (!token) {
    throw new Error("Token requerido")
  }

  const response = await fetch(buildApiUrl(`/users/${userId}`), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error("Error obteniendo usuario")
  }

  const data = await response.json()
  return mapUser(data)
}

/**
 * Actualizar usuario
 * @param {string} userId - ID del usuario
 * @param {Object} updateData - Datos a actualizar
 * @param {string} token - Token JWT
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUser = async (userId, updateData, token) => {
  if (!token) {
    throw new Error("Token requerido")
  }

  const response = await fetch(buildApiUrl(`/users/${userId}`), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error actualizando usuario")
  }

  const data = await response.json()
  return mapUser(data)
}

/**
 * Eliminar usuario
 * @param {string} userId - ID del usuario
 * @param {string} token - Token JWT
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const deleteUser = async (userId, token) => {
  if (!token) {
    throw new Error("Token requerido")
  }

  const response = await fetch(buildApiUrl(`/users/${userId}`), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error eliminando usuario")
  }

  return await response.json()
}
