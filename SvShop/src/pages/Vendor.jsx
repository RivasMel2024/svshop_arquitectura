import { useEffect, useMemo, useState } from "react"
import {
  Package,
  Trash2,
  BarChart3,
  ShoppingBag,
  Plus,
  Edit,
  User,
  LogOut,
  RefreshCw,
  Truck
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"
import toast from "react-hot-toast"

import AddProductModal from "../components/AddProductModal"
import EditProductModal from "../components/EditProductModal"
import { getProducts, disableProduct } from "../services/products.api"
import { getOrdersBySeller, updateOrderStatus } from "../services/orders.api"

const validTransitions = {
  PENDIENTE: ["EN_CAMINO", "CANCELADA"],
  EN_CAMINO: ["RECIBIDA", "CANCELADA"],
  RECIBIDA: [],
  CANCELADA: []
}

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`

const isOwnerProduct = (product, userId) => {
  return Boolean(product?.sellerId) && String(product.sellerId) === String(userId)
}

function Vendor({ authToken, currentUser, navigate, onLogout, onProductsChanged }) {
  const [activeTab, setActiveTab] = useState("inventory")

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState("")

  const [sellerOrders, setSellerOrders] = useState([])
  const [sellerOrdersLoading, setSellerOrdersLoading] = useState(false)
  const [sellerOrdersError, setSellerOrdersError] = useState("")
  const [selectedStates, setSelectedStates] = useState({})

  const sellerId = currentUser?.id

  useEffect(() => {
    const role = currentUser?.rol || currentUser?.role
    if (role && role !== "VENDEDOR") {
      navigate("home")
    }
  }, [currentUser, navigate])

  useEffect(() => {
    if (!authToken || !sellerId) return
    loadProducts()
    loadSellerOrders()
  }, [authToken, sellerId])

  const loadProducts = async () => {
    if (!sellerId) return

    try {
      setProductsLoading(true)
      setProductsError("")
      const allProducts = await getProducts({ page: 1, limit: 100 })
      const ownProducts = allProducts.filter((product) => isOwnerProduct(product, sellerId))
      setProducts(ownProducts)
    } catch (error) {
      setProductsError(error.message || "Error cargando inventario")
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  const loadSellerOrders = async () => {
    if (!authToken || !sellerId) return

    try {
      setSellerOrdersLoading(true)
      setSellerOrdersError("")
      const result = await getOrdersBySeller({
        sellerId,
        token: authToken,
        page: 1,
        limit: 50
      })

      const orders = Array.isArray(result.data) ? result.data : []
      setSellerOrders(orders)

      const statesMap = {}
      orders.forEach((order) => {
        const sellerState = Array.isArray(order.estadosVendedor)
          ? order.estadosVendedor.find((entry) => String(entry.vendedorId) === String(sellerId))
          : null
        statesMap[order._id] = sellerState?.estado || order.estado
      })
      setSelectedStates(statesMap)
    } catch (error) {
      setSellerOrdersError(error.message || "Error cargando ventas")
      setSellerOrders([])
    } finally {
      setSellerOrdersLoading(false)
    }
  }

  const refreshAll = async () => {
    await Promise.all([loadProducts(), loadSellerOrders()])
    if (onProductsChanged) {
      await onProductsChanged()
    }
  }

  const handleDeleteProduct = async (productId) => {
    const product = products.find((item) => item.id === productId)
    if (!isOwnerProduct(product, sellerId)) {
      toast.error("Solo puedes deshabilitar tus propios productos")
      return
    }

    if (!window.confirm("¿Deshabilitar este producto?")) return

    try {
      await disableProduct(productId, authToken)
      toast.success("Producto deshabilitado")
      await loadProducts()
      if (onProductsChanged) {
        await onProductsChanged()
      }
    } catch (error) {
      toast.error(error.message || "No se pudo deshabilitar el producto")
    }
  }

  const handleOpenEditProduct = (product) => {
    if (!isOwnerProduct(product, sellerId)) {
      toast.error("Solo puedes editar tus propios productos")
      return
    }

    setSelectedProduct(product)
    setIsEditProductModalOpen(true)
  }

  const handleProductAdded = async () => {
    await loadProducts()
    if (onProductsChanged) {
      await onProductsChanged()
    }
  }

  const handleProductUpdated = async () => {
    await loadProducts()
    if (onProductsChanged) {
      await onProductsChanged()
    }
  }

  const handleChangeOrderState = async (orderId) => {
    const order = sellerOrders.find((item) => item._id === orderId)
    const sellerState = Array.isArray(order?.estadosVendedor)
      ? order.estadosVendedor.find((entry) => String(entry.vendedorId) === String(sellerId))
      : null
    const currentState = sellerState?.estado || order?.estado
    const targetState = selectedStates[orderId]

    if (!order || !targetState || targetState === currentState) {
      return
    }

    try {
      await updateOrderStatus({
        orderId,
        token: authToken,
        newState: targetState,
        comment: `Actualizado por vendedor ${currentUser?.nombre || ""}`
      })

      toast.success("Estado de orden actualizado")
      await loadSellerOrders()
    } catch (error) {
      toast.error(error.message || "No se pudo actualizar la orden")
    }
  }

  const totalSales = useMemo(() => {
    return sellerOrders.reduce((sum, order) => {
      const items = Array.isArray(order?.items) ? order.items : []
      const sellerItems = items.filter((item) => String(item?.vendedorId) === String(sellerId))
      const sellerTotal = sellerItems.reduce(
        (partial, item) => partial + Number(item?.subtotal ?? (item?.precioUnitario || 0) * (item?.cantidad || 0)),
        0
      )
      return sum + sellerTotal
    }, 0)
  }, [sellerOrders, sellerId])

  const soldItems = useMemo(() => {
    return sellerOrders.reduce((count, order) => {
      const items = Array.isArray(order?.items) ? order.items : []
      const sellerItems = items.filter((item) => String(item?.vendedorId) === String(sellerId))
      return count + sellerItems.reduce((partial, item) => partial + Number(item?.cantidad || 0), 0)
    }, 0)
  }, [sellerOrders, sellerId])

  const salesData = useMemo(() => {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const byMonth = {}

    sellerOrders.forEach((order) => {
      const rawDate = order?.createdAt || order?.fechaCreacion
      const date = rawDate ? new Date(rawDate) : null
      if (!date || Number.isNaN(date.getTime())) return

      const items = Array.isArray(order?.items) ? order.items : []
      const sellerItems = items.filter((item) => String(item?.vendedorId) === String(sellerId))
      const sellerTotal = sellerItems.reduce(
        (sum, item) => sum + Number(item?.subtotal ?? (item?.precioUnitario || 0) * (item?.cantidad || 0)),
        0
      )

      const key = `${date.getFullYear()}-${date.getMonth()}`
      byMonth[key] = (byMonth[key] || 0) + sellerTotal
    })

    const points = []
    for (let i = 4; i >= 0; i -= 1) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      points.push({
        month: monthNames[date.getMonth()],
        sales: Number(byMonth[key] || 0)
      })
    }

    return points
  }, [sellerOrders, sellerId])

  return (
    <div className="min-h-screen bg-[#FFF5F2] flex">
      <div className="w-64 bg-[#F57656] text-white p-6 space-y-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Vendor Panel</h2>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
            activeTab === "inventory" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <Package className="h-5 w-5" /> Inventario
        </button>

        <button
          onClick={() => setActiveTab("sales")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
            activeTab === "sales" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <ShoppingBag className="h-5 w-5" /> Ventas
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
            activeTab === "stats" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <BarChart3 className="h-5 w-5" /> Estadisticas
        </button>

        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
            activeTab === "account" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <User className="h-5 w-5" /> Mi cuenta
        </button>
      </div>

      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Panel del Vendedor</h1>
          <button
            onClick={refreshAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
        </div>

        {activeTab === "inventory" && (
          <div className="bg-white rounded-3xl shadow p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Mi Inventario ({products.length})</h2>
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="flex items-center gap-2 bg-[#F57656] text-white px-4 py-2 rounded-xl hover:bg-[#CB6045]"
              >
                <Plus className="h-4 w-4" />
                Agregar Producto
              </button>
            </div>

            {productsLoading && <p className="text-gray-500">Cargando inventario...</p>}
            {productsError && <p className="text-red-500">{productsError}</p>}

            {!productsLoading && !productsError && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                  <p className="text-gray-500 md:col-span-2 lg:col-span-3">No tienes productos registrados.</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="bg-[#FFF5F2] p-4 rounded-xl">
                      <img
                        src={product.image || "https://picsum.photos/400/280"}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />

                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                      <p className={`text-sm font-semibold ${product.stock < 5 ? "text-red-500" : "text-gray-600"}`}>
                        Stock: {product.stock}
                      </p>

                      {product.stock < 5 && (
                        <p className="text-xs text-red-500">Stock bajo, considera reponer.</p>
                      )}

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleOpenEditProduct(product)}
                          className="p-2 bg-yellow-100 rounded-lg"
                          title="Editar producto"
                        >
                          <Edit className="h-4 w-4 text-yellow-700" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 bg-red-100 rounded-lg"
                          title="Deshabilitar producto"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "sales" && (
          <div className="bg-white rounded-3xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Ventas / Ordenes ({sellerOrders.length})</h2>

            {sellerOrdersLoading && <p className="text-gray-500">Cargando ventas...</p>}
            {sellerOrdersError && <p className="text-red-500">{sellerOrdersError}</p>}

            {!sellerOrdersLoading && !sellerOrdersError && (
              <div className="space-y-4">
                {sellerOrders.length === 0 ? (
                  <p className="text-gray-500">Aun no tienes ordenes asignadas.</p>
                ) : (
                  sellerOrders.map((order) => {
                    const sellerState = Array.isArray(order.estadosVendedor)
                      ? order.estadosVendedor.find((entry) => String(entry.vendedorId) === String(sellerId))
                      : null
                    const currentState = sellerState?.estado || order.estado
                    const allowedStates = validTransitions[currentState] || []
                    const selectedState = selectedStates[order._id] || currentState
                    const items = Array.isArray(order.items) ? order.items : []
                    const sellerItems = items.filter((item) => String(item?.vendedorId) === String(sellerId))
                    const sellerTotal = sellerItems.reduce(
                      (sum, item) => sum + Number(item?.subtotal ?? (item?.precioUnitario || 0) * (item?.cantidad || 0)),
                      0
                    )

                    return (
                      <div key={order._id} className="bg-[#FFF5F2] p-4 rounded-xl border border-[#FDE4DD]">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <p className="font-semibold">Pedido #{order.numeroOrden || order._id}</p>
                            <p className="text-sm text-gray-500">Estado actual: {currentState}</p>
                            <p className="text-sm text-gray-500">Total: {formatCurrency(sellerTotal)}</p>
                            <p className="text-xs text-gray-400">
                              Fecha: {order?.createdAt ? new Date(order.createdAt).toLocaleString() : "Sin fecha"}
                            </p>

                            <div className="mt-3 space-y-1">
                              {sellerItems.map((item, index) => (
                                <p key={`${order._id}-${index}`} className="text-xs text-gray-600">
                                  {item?.cantidad || 0}x {item?.nombreProducto || "Producto"}
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <select
                              value={selectedState}
                              onChange={(e) =>
                                setSelectedStates((prev) => ({
                                  ...prev,
                                  [order._id]: e.target.value
                                }))
                              }
                              className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            >
                              <option value={currentState}>{currentState}</option>
                              {allowedStates.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleChangeOrderState(order._id)}
                              disabled={!allowedStates.includes(selectedState)}
                              className="px-3 py-2 rounded-lg bg-[#F57656] text-white text-sm font-semibold hover:bg-[#CB6045] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="inline-flex items-center gap-2">
                                <Truck className="h-4 w-4" /> Actualizar
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-sm text-gray-500">Ventas Totales</p>
                <p className="text-3xl font-bold">{formatCurrency(totalSales)}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-sm text-gray-500">Productos Activos</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-sm text-gray-500">Unidades Vendidas</p>
                <p className="text-3xl font-bold">{soldItems}</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow">
              <h2 className="text-xl font-bold mb-6">Ventas por Mes</h2>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="sales" stroke="#F57656" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="bg-white rounded-3xl shadow p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Mi cuenta</h2>
            <p className="text-gray-600">Nombre: {currentUser?.nombre || "-"}</p>
            <p className="text-gray-600">Correo: {currentUser?.email || "-"}</p>
            <p className="text-gray-600 mb-6">Rol: {currentUser?.rol || currentUser?.role || "VENDEDOR"}</p>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("home")}
                className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
              >
                Ir a tienda
              </button>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F57656] text-white rounded-xl hover:bg-[#CB6045]"
              >
                <LogOut className="h-4 w-4" /> Cerrar sesion
              </button>
            </div>
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onProductAdded={handleProductAdded}
        authToken={authToken}
        currentUser={currentUser}
      />

      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => {
          setIsEditProductModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
        authToken={authToken}
        currentUser={currentUser}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  )
}

export default Vendor
