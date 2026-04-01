import { useState, useEffect } from "react"
import {
  Users,
  Package,
  Settings,
  LifeBuoy,
  User,
  LogOut,
  Pencil,
  UserX,
  Plus,
  Truck
} from "lucide-react"
import toast from "react-hot-toast"
import AddProductModal from "../components/AddProductModal"
import EditProductModal from "../components/EditProductModal"
import { getProducts, disableProduct } from "../services/products.api"
import { getAllUsers, deleteUser } from "../services/users.api"
import { getOrdersBySeller, updateOrderStatus } from "../services/orders.api"

function Admin({ authToken, currentUser, navigate, onLogout, onProductsChanged }) {
  const userRole = currentUser?.rol || currentUser?.role || ""
  const isSeller = userRole === "VENDEDOR"
  const isAdmin = userRole === "ADMINISTRADOR"

  const [activeTab, setActiveTab] = useState(() => (isSeller ? "products" : "users"))
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [userRoleFilter, setUserRoleFilter] = useState("TODOS")

  // Estado para Usuarios
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState("")

  // Estado para Productos
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState("")

  // Estado para Órdenes de vendedor
  const [sellerOrders, setSellerOrders] = useState([])
  const [sellerOrdersLoading, setSellerOrdersLoading] = useState(false)
  const [sellerOrdersError, setSellerOrdersError] = useState("")
  const [selectedStates, setSelectedStates] = useState({})

  // Mock Tickets Soporte (sin API aún)
  const [tickets] = useState([
    { id: 101, user: "Allison", issue: "No puedo pagar", status: "Pendiente" },
    { id: 102, user: "Carlos", issue: "Producto defectuoso", status: "Resuelto" }
  ])

  // 📥 Cargar usuarios al montar
  useEffect(() => {
    if (isAdmin) {
      loadUsers()
    }
    loadProducts()
    if (isSeller) {
      loadSellerOrders()
    }
  }, [authToken, isAdmin])

  useEffect(() => {
    if (isSeller && activeTab !== "products" && activeTab !== "orders" && activeTab !== "account") {
      setActiveTab("products")
    }
  }, [isSeller, activeTab])

  // 📥 Función para cargar usuarios del backend
  const loadUsers = async () => {
    if (!authToken) return

    try {
      setUsersLoading(true)
      setUsersError("")
      const data = await getAllUsers(authToken, { page: 1, limit: 50 })
      setUsers(data)
    } catch (error) {
      setUsersError(error.message || "Error cargando usuarios")
      setUsers([])
    } finally {
      setUsersLoading(false)
    }
  }

  // 📥 Función para cargar productos del backend
  const loadProducts = async () => {
    try {
      setProductsLoading(true)
      setProductsError("")
      const data = await getProducts({ page: 1, limit: 50 })
      setProducts(data)
    } catch (error) {
      setProductsError(error.message || "Error cargando productos")
      setProducts([])
    } finally {
      setProductsLoading(false)
    }
  }

  const loadSellerOrders = async () => {
    if (!authToken || !currentUser?.id || !isSeller) return

    try {
      setSellerOrdersLoading(true)
      setSellerOrdersError("")
      const result = await getOrdersBySeller({
        sellerId: currentUser.id,
        token: authToken,
        page: 1,
        limit: 50
      })

      const orders = Array.isArray(result.data) ? result.data : []
      setSellerOrders(orders)

      const nextStates = {}
      orders.forEach((order) => {
        nextStates[order._id] = order.estado
      })
      setSelectedStates(nextStates)
    } catch (error) {
      setSellerOrdersError(error.message || "Error cargando órdenes del vendedor")
      setSellerOrders([])
    } finally {
      setSellerOrdersLoading(false)
    }
  }

  // 🗑️ Eliminar usuario
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("¿Eliminar este usuario?")) return

    try {
      await deleteUser(userId, authToken)
      toast.success("Usuario eliminado")
      loadUsers()
    } catch (error) {
      toast.error(error.message || "Error eliminando usuario")
    }
  }

  // 🗑️ Eliminar producto
  const handleDeleteProduct = async (productId) => {
    const product = products.find((item) => item.id === productId)
    const isSeller = currentUser?.rol === "VENDEDOR"
    const isOwner = product?.sellerId && currentUser?.id === product.sellerId

    if (isSeller && !isOwner) {
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
      toast.error(error.message || "Error deshabilitando producto")
    }
  }

  // ✅ Refrescar productos después de crear uno
  const handleProductAdded = async () => {
    await loadProducts()
    if (onProductsChanged) {
      await onProductsChanged()
    }
  }

  const handleOpenEditProduct = (product) => {
    const isOwner = currentUser?.id === product?.sellerId

    if (!isSeller || !isOwner) {
      toast.error("Solo puedes editar tus propios productos")
      return
    }

    setSelectedProduct(product)
    setIsEditProductModalOpen(true)
  }

  const handleProductUpdated = async () => {
    await loadProducts()
    if (onProductsChanged) {
      await onProductsChanged()
    }
  }

  const validTransitions = {
    PENDIENTE: ["EN_CAMINO", "CANCELADA"],
    EN_CAMINO: ["RECIBIDA", "CANCELADA"],
    RECIBIDA: [],
    CANCELADA: []
  }

  const handleChangeOrderState = async (orderId) => {
    const order = sellerOrders.find((item) => item._id === orderId)
    const targetState = selectedStates[orderId]

    if (!order || !targetState || targetState === order.estado) {
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

  const filteredUsers = users.filter((user) => {
    if (userRoleFilter === "TODOS") return true
    return user.role === userRoleFilter
  })

  return (
    <div className="min-h-screen bg-[#FFF5F2] flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#F57656] text-white p-6 space-y-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        {isAdmin && (
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
              activeTab === "users" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
            }`}
          >
            <Users className="h-5 w-5" /> Usuarios
          </button>
        )}

        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
            activeTab === "products" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <Package className="h-5 w-5" /> Productos
        </button>

        {isSeller && (
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
              activeTab === "orders" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
            }`}
          >
            <Truck className="h-5 w-5" /> Órdenes
          </button>
        )}

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab("support")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
                activeTab === "support" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
              }`}
            >
              <LifeBuoy className="h-5 w-5" /> Soporte
            </button>

            <button
              onClick={() => setActiveTab("system")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
                activeTab === "system" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
              }`}
            >
              <Settings className="h-5 w-5" /> Sistema
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
            activeTab === "account" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <User className="h-5 w-5" /> Mi Cuenta
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8">

        <div className="flex items-center justify-end gap-3 mb-6">
          <button
            onClick={() => setActiveTab("account")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#F57656] text-[#F57656] hover:bg-[#FDE4DD] transition"
          >
            <User className="h-4 w-4" />
            Mi Cuenta
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Panel Administrativo</h1>

        {/* ================= USERS ================= */}
        {isAdmin && activeTab === "users" && (
          <div className="bg-white rounded-3xl shadow-md p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Gestión de Usuarios ({filteredUsers.length})</h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUserRoleFilter("TODOS")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    userRoleFilter === "TODOS"
                      ? "bg-[#F57656] text-white"
                      : "bg-[#FDE4DD] text-[#CB6045] hover:bg-[#FCD6CC]"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setUserRoleFilter("CLIENTE")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    userRoleFilter === "CLIENTE"
                      ? "bg-[#F57656] text-white"
                      : "bg-[#FDE4DD] text-[#CB6045] hover:bg-[#FCD6CC]"
                  }`}
                >
                  Cliente
                </button>
                <button
                  onClick={() => setUserRoleFilter("VENDEDOR")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    userRoleFilter === "VENDEDOR"
                      ? "bg-[#F57656] text-white"
                      : "bg-[#FDE4DD] text-[#CB6045] hover:bg-[#FCD6CC]"
                  }`}
                >
                  Vendedor
                </button>
                <button
                  onClick={() => setUserRoleFilter("ADMINISTRADOR")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    userRoleFilter === "ADMINISTRADOR"
                      ? "bg-[#F57656] text-white"
                      : "bg-[#FDE4DD] text-[#CB6045] hover:bg-[#FCD6CC]"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {usersLoading && <p className="text-gray-500">Cargando usuarios...</p>}
            {usersError && <p className="text-red-500">{usersError}</p>}

            {!usersLoading && !usersError && (
              <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay usuarios registrados</p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center p-4 bg-[#FFF5F2] rounded-xl"
                    >
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">Rol: {user.role}</p>
                      </div>

                      <div className="flex gap-3 items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.active ? "Activo" : "Deshabilitado"}
                        </span>

                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:scale-105 transition"
                          title="Deshabilitar usuario"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= PRODUCTS ================= */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 flex justify-between items-center">
              Gestión de Productos ({products.length})
              {currentUser?.rol === "VENDEDOR" && (
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="flex items-center gap-2 bg-[#F57656] text-white px-4 py-2 rounded-xl hover:bg-[#CB6045] transition"
                >
                  <Plus className="h-4 w-4" />
                  Agregar
                </button>
              )}
            </h2>

            {currentUser?.rol === "ADMINISTRADOR" && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
                <p className="text-sm text-blue-700">Como administrador, puedes deshabilitar productos. Para crear nuevos productos, usa tu cuenta de vendedor.</p>
              </div>
            )}

            {productsLoading && <p className="text-gray-500">Cargando productos...</p>}
            {productsError && <p className="text-red-500">{productsError}</p>}

            {!productsLoading && !productsError && (
              <div className="space-y-4">
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No hay productos registrados</p>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-4 bg-[#FFF5F2] rounded-xl"
                    >
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 mt-1">Stock: {product.stock}</p>
                        {product.sellerName && (
                          <p className="text-xs text-gray-400 mt-1">Vendedor: {product.sellerName}</p>
                        )}
                      </div>

                      {(() => {
                        const isSeller = currentUser?.rol === "VENDEDOR"
                        const isOwner = currentUser?.id === product.sellerId
                        const canDisable = currentUser?.rol === "ADMINISTRADOR" || (isSeller && isOwner)
                        const canEdit = isSeller && isOwner

                        if (!canDisable && !canEdit) {
                          return (
                            <span className="text-xs text-gray-400">Solo propietario</span>
                          )
                        }

                        return (
                          <div className="flex items-center gap-2">
                            {canEdit && (
                              <button
                                onClick={() => handleOpenEditProduct(product)}
                                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:scale-105 transition"
                                title="Editar producto"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}

                            {canDisable && (
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:scale-105 transition"
                                title="Deshabilitar producto"
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )
                      })()}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= SELLER ORDERS ================= */}
        {isSeller && activeTab === "orders" && (
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Órdenes de tus productos ({sellerOrders.length})</h2>

            {sellerOrdersLoading && <p className="text-gray-500">Cargando órdenes...</p>}
            {sellerOrdersError && <p className="text-red-500">{sellerOrdersError}</p>}

            {!sellerOrdersLoading && !sellerOrdersError && (
              <div className="space-y-4">
                {sellerOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aún no tienes órdenes asignadas</p>
                ) : (
                  sellerOrders.map((order) => {
                    const allowedStates = validTransitions[order.estado] || []

                    return (
                      <div
                        key={order._id}
                        className="bg-[#FFF5F2] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div>
                          <p className="font-semibold">Pedido #{order.numeroOrden || order._id}</p>
                          <p className="text-sm text-gray-500">Estado actual: {order.estado}</p>
                          <p className="text-sm text-gray-500">Total: ${Number(order?.totales?.total || 0).toFixed(2)}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={selectedStates[order._id] || order.estado}
                            onChange={(e) => setSelectedStates((prev) => ({
                              ...prev,
                              [order._id]: e.target.value
                            }))}
                            className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                          >
                            <option value={order.estado}>{order.estado}</option>
                            {allowedStates.map((state) => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleChangeOrderState(order._id)}
                            disabled={!allowedStates.includes(selectedStates[order._id])}
                            className="px-3 py-2 rounded-lg bg-[#F57656] text-white text-sm font-semibold hover:bg-[#CB6045] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Actualizar
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= SUPPORT ================= */}
        {isAdmin && activeTab === "support" && (
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Soporte Técnico</h2>

            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 bg-[#FFF5F2] rounded-xl flex justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      Ticket #{ticket.id} - {ticket.user}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.issue}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ticket.status === "Resuelto"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SYSTEM ================= */}
        {isAdmin && activeTab === "system" && (
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Monitor del Sistema</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#FDE4DD] p-6 rounded-2xl">
                <p className="text-sm text-gray-600">Usuarios Registrados</p>
                <p className="text-3xl font-bold">{users.length}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {users.filter((u) => u.active).length} activos
                </p>
              </div>

              <div className="bg-[#FCD6CC] p-6 rounded-2xl">
                <p className="text-sm text-gray-600">Productos en Catálogo</p>
                <p className="text-3xl font-bold">{products.length}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Stock total: {products.reduce((sum, p) => sum + (p.stock || 0), 0)}
                </p>
              </div>

              <div className="bg-[#FFF5F2] p-6 rounded-2xl">
                <p className="text-sm text-gray-600">Tickets Pendientes</p>
                <p className="text-3xl font-bold">
                  {tickets.filter((t) => t.status === "Pendiente").length}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {tickets.filter((t) => t.status === "Resuelto").length} resueltos
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="bg-white rounded-3xl shadow-md p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Mi Cuenta</h2>

            <div className="space-y-4">
              <div className="bg-[#FFF5F2] rounded-xl p-4">
                <p className="text-xs text-gray-500">Nombre</p>
                <p className="font-semibold">{currentUser?.nombre || "-"}</p>
              </div>
              <div className="bg-[#FFF5F2] rounded-xl p-4">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold">{currentUser?.email || "-"}</p>
              </div>
              <div className="bg-[#FFF5F2] rounded-xl p-4">
                <p className="text-xs text-gray-500">Rol</p>
                <p className="font-semibold">{userRole || "-"}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="mt-6 bg-red-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-red-600 transition inline-flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Salir de sesión
            </button>
          </div>
        )}

      </div>

      {/* MODAL AGREGAR PRODUCTO */}
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

export default Admin