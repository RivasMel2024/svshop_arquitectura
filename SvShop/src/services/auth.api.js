import { buildApiUrl } from "./api.config"

export const loginUser = async ({ email, password }) => {
  const response = await fetch(buildApiUrl("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo iniciar sesión")
  }

  return data
}

export const registerUser = async ({ nombre, email, password }) => {
  const response = await fetch(buildApiUrl("/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nombre, email, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo registrar el usuario")
  }

  return data
}

export const getMyProfile = async (token) => {
  const response = await fetch(buildApiUrl("/auth/me"), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "No se pudo obtener el perfil")
  }

  return data
}
