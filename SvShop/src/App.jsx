import { useState } from "react"
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
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"

import MOCK_PRODUCTS from "./data/products"

function App() {
  const [currentRoute, setCurrentRoute] = useState("login")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Cambia a false o true para simular no autenticado

  // 🔹 Navegación protegida
  const navigate = (route) => {
    if (
      !isAuthenticated &&
      route !== "login" &&
      route !== "register" &&
      route !== "forgot"
    ) {
      toast.error("Debes iniciar sesión primero")
      return
    }

    setCurrentRoute(route)
  }

  // 🔹 Login simulado
  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentRoute("home")
    toast.success("Bienvenida a SVShop ✨")
  }

  // 🔹 Logout
  const handleLogout = () => {
    setIsAuthenticated(false)
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

  // 🔹 Router Manual
  const renderView = () => {
    switch (currentRoute) {
      case "login":
        return <Login navigate={navigate} onLogin={handleLogin} />

      case "register":
        return <Register navigate={navigate} />

      case "forgot":
        return <ForgotPassword navigate={navigate} />

      case "home":
        return (
          <Home
            navigate={navigate}
            products={MOCK_PRODUCTS}
            onAddToCart={addToCart}
            onViewProduct={viewProduct}
          />
        )

      case "catalog":
        return (
          <Catalog
            navigate={navigate}
            products={MOCK_PRODUCTS}
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
          />
        )

      case "success":
        return <OrderSuccess navigate={navigate} />

      case "account":
        return <Account navigate={navigate} />

      default:
        return <Login navigate={navigate} onLogin={handleLogin} />
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      {isAuthenticated && (
        <Navbar
          navigate={navigate}
          cartItemsCount={cartItems.length}
          currentRoute={currentRoute}
          onLogout={handleLogout}
        />
      )}

      {renderView()}
    </>
  )
}

export default App
