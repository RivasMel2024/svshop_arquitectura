const rawBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080").trim()

const withoutTrailingSlash = rawBaseUrl.replace(/\/+$/, "")
const normalizedBaseUrl = withoutTrailingSlash.endsWith("/api")
  ? withoutTrailingSlash.slice(0, -4)
  : withoutTrailingSlash

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${normalizedBaseUrl}/api${normalizedPath}`
}
