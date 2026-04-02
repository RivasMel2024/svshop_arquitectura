import { useEffect, useState } from "react"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Catalog from "./pages/Catalog"
import ProductDetails from "./pages/ProductDetails"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import OrderSuccess from "./pages/OrderSuccess"
import Account from "./pages/Account"
import Admin from "./pages/Admin"
import Vendor from "./pages/Vendor"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import { getProducts } from "./services/products.api"
import { getMyProfile, loginUser, registerUser } from "./services/auth.api"
import { getOrdersByUser } from "./services/orders.api"

const TOKEN_KEY = "svshop_token"
const USER_KEY = "svshop_user"

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function App() {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "")
  const [currentUser, setCurrentUser] = useState(() => getStoredUser())
  const [currentRoute, setCurrentRoute] = useState("home")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState("")
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState("")
  const isAuthenticated = Boolean(authToken)
  const userRole = currentUser?.rol || currentUser?.role || ""
  const isBackofficeUser = userRole === "ADMINISTRADOR" || userRole === "VENDEDOR"
  const isSeller = userRole === "VENDEDOR"

  const saveSession = (token, user) => {
    setAuthToken(token)
    setCurrentUser(user)
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  const clearSession = () => {
    setAuthToken("")
    setCurrentUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  const loadProducts = async () => {
    try {
      setProductsLoading(true)
      setProductsError("")
      const data = await getProducts({ page: 1, limit: 20, disponible: true })
      setProducts(data)
    } catch (error) {
      setProductsError(error.message || "No se pudo cargar el catálogo")
    } finally {
      setProductsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (["home", "catalog"].includes(currentRoute)) {
      loadProducts()
    }
  }, [currentRoute])

  useEffect(() => {
    const syncProfile = async () => {
      if (!authToken) return

      try {
        const response = await getMyProfile(authToken)
        const user = response.user
        setCurrentUser(user)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
      } catch (error) {
        clearSession()
        setCurrentRoute("login")
        toast.error(error.message || "Tu sesión expiró. Inicia sesión nuevamente")
      }
    }

    syncProfile()
  }, [authToken])

  useEffect(() => {
    if (!isAuthenticated || !isBackofficeUser) return

    const storeRoutes = ["home", "catalog", "product", "cart", "checkout", "success"]
    if (storeRoutes.includes(currentRoute)) {
      setCurrentRoute(isSeller ? "vendor" : "admin")
    }
  }, [isAuthenticated, isBackofficeUser, currentRoute, isSeller])

  useEffect(() => {
    const loadOrders = async () => {
      if (!authToken || !currentUser?.id) {
        setOrders([])
        setOrdersError("")
        return
      }

      try {
        setOrdersLoading(true)
        setOrdersError("")
        const result = await getOrdersByUser({
          userId: currentUser.id,
          token: authToken,
          page: 1,
          limit: 20
        })
        setOrders(Array.isArray(result.data) ? result.data : [])
      } catch (error) {
        setOrders([])
        setOrdersError(error.message || "No se pudo cargar el historial de pedidos")
      } finally {
        setOrdersLoading(false)
      }
    }

    loadOrders()
  }, [authToken, currentUser?.id])

  // 🔹 Navegación protegida
  const navigate = (route, payload = null) => {
    const protectedRoutes = ["cart", "checkout", "account"]
    const backofficeRoutes = ["admin", "vendor"]

    // Validar rutas que requieren autenticación
    if (
      !isAuthenticated &&
      protectedRoutes.includes(route)
    ) {
      toast.error("Debes iniciar sesión para usar carrito, pedidos y tu cuenta")
      setCurrentRoute("login")
      return
    }

    // Validar rutas que requieren rol ADMIN o VENDEDOR
    if (backofficeRoutes.includes(route)) {
      if (!isAuthenticated) {
        toast.error("Debes iniciar sesión para acceder al panel administrativo")
        setCurrentRoute("login")
        return
      }

      const userRole = currentUser?.rol || currentUser?.role || ""
      const isAdmin = userRole === "ADMINISTRADOR" || userRole === "VENDEDOR"

      if (!isAdmin) {
        toast.error("No tienes permiso para acceder al panel administrativo")
        setCurrentRoute("home")
        return
      }

      if (route === "admin" && userRole === "VENDEDOR") {
        setCurrentRoute("vendor")
        return
      }

      if (route === "vendor" && userRole !== "VENDEDOR") {
        setCurrentRoute("admin")
        return
      }
    }

    if (route === "product" && payload) {
      setSelectedProduct(payload)
    }

    setCurrentRoute(route)
  }

  const handleLogin = async ({ email, password }) => {
    const result = await loginUser({ email, password })
    saveSession(result.token, result.user)
    const role = result.user?.rol || result.user?.role || ""
    const isAdminOrSeller = role === "ADMINISTRADOR" || role === "VENDEDOR"
    if (!isAdminOrSeller) {
      setCurrentRoute("home")
    } else {
      setCurrentRoute(role === "VENDEDOR" ? "vendor" : "admin")
    }
    toast.success(`Bienvenida ${result.user.nombre} ✨`)
  }

  const handleRegister = async ({ nombre, email, password }) => {
    await registerUser({ nombre, email, password })
    toast.success("Cuenta creada con éxito 🎉")
    setCurrentRoute("login")
  }

  // 🔹 Logout
  const handleLogout = () => {
    clearSession()
    setCartItems([])
    setCurrentRoute("login")
    toast.success("Sesión cerrada")
  }

  // 🔹 Ver producto
  const viewProduct = (product) => {
    if (!product) return
    setSelectedProduct(product)
    setCurrentRoute("product")
  }

  // 🔹 Agregar al carrito
  const addToCart = (product) => {
    if (!product) return

    if (!isAuthenticated) {
      toast.error("Inicia sesión o crea una cuenta para agregar al carrito")
      setCurrentRoute("login")
      return
    }

    const existing = cartItems.find((item) => item.id === product.id)

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }

    toast.success("Producto agregado 🛒")
  }

  // 🔹 Actualizar cantidad
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
    toast.success("Producto eliminado")
  }

  const clearCart = () => {
    setCartItems([])
  }

  // 🔹 Refrescar órdenes después de crear una
  const refreshOrders = async () => {
    if (!authToken || !currentUser?.id) return

    try {
      const result = await getOrdersByUser({
        userId: currentUser.id,
        token: authToken,
        page: 1,
        limit: 20
      })
      setOrders(Array.isArray(result.data) ? result.data : [])
    } catch (error) {
      console.error("Error refrescando órdenes:", error)
    }
  }

  // 🔹 Router Manual
  const renderView = () => {
    switch (currentRoute) {
      case "login":
        return <Login navigate={navigate} onLogin={handleLogin} />

      case "register":
        return <Register navigate={navigate} onRegister={handleRegister} />

      case "forgot":
        return <ForgotPassword navigate={navigate} />

      case "home":
        return (
          <Home
            navigate={navigate}
            products={products}
            loading={productsLoading}
            error={productsError}
            onAddToCart={addToCart}
            onViewProduct={viewProduct}
          />
        )

      case "catalog":
        return (
          <Catalog
            navigate={navigate}
            products={products}
            loading={productsLoading}
            error={productsError}
            onAddToCart={addToCart}
            onViewProduct={viewProduct}
          />
        )

      case "product":
        return (
          <ProductDetails
            product={selectedProduct}
            navigate={navigate}
            onAddToCart={addToCart}
          />
        )

      case "cart":
        return (
          <Cart
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            navigate={navigate}
          />
        )

      case "checkout":
        return (
          <Checkout
            cartItems={cartItems}
            navigate={navigate}
            clearCart={clearCart}
            authToken={authToken}
            currentUser={currentUser}
            onOrderCreated={refreshOrders}
          />
        )

      case "success":
        return <OrderSuccess navigate={navigate} />

      case "account":
        return (
          <Account
            navigate={navigate}
            onLogout={handleLogout}
            user={currentUser}
            orders={orders}
            ordersLoading={ordersLoading}
            ordersError={ordersError}
          />
        )

      case "admin":
        return (
          <Admin
            authToken={authToken}
            currentUser={currentUser}
            navigate={navigate}
            onLogout={handleLogout}
            onProductsChanged={loadProducts}
          />
        )

      case "vendor":
        return (
          <Vendor
            authToken={authToken}
            currentUser={currentUser}
            navigate={navigate}
            onLogout={handleLogout}
            onProductsChanged={loadProducts}
          />
        )

      default:
        return <Login navigate={navigate} onLogin={handleLogin} />
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      {!( ["login", "register", "forgot", "admin", "vendor"].includes(currentRoute)) && (
        <Navbar
          navigate={navigate}
          cartItemsCount={cartItems.length}
          currentRoute={currentRoute}
          onLogout={handleLogout}
          currentUser={currentUser}
        />
      )}

      {renderView()}
    </>
  )
}

export default App
