import { useState, useEffect } from "react"
import {
  Users,
  Package,
  Settings,
  LifeBuoy,
  User,
  LogOut,
  UserX
} from "lucide-react"
import toast from "react-hot-toast"
import { getProducts, disableProduct } from "../services/products.api"
import { getAllUsers, deleteUser } from "../services/users.api"

function Admin({ authToken, currentUser, navigate, onLogout, onProductsChanged }) {
  const userRole = currentUser?.rol || currentUser?.role || ""
  const isAdmin = userRole === "ADMINISTRADOR"

  const [activeTab, setActiveTab] = useState("users")
  const [userRoleFilter, setUserRoleFilter] = useState("TODOS")

  // Estado para Usuarios
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState("")

  // Estado para Productos
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState("")

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
  }, [authToken, isAdmin])

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
            </h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
              <p className="text-sm text-blue-700">Como administrador, puedes deshabilitar productos. La creación y edición se hace desde el panel de vendedor.</p>
            </div>

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

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:scale-105 transition"
                          title="Deshabilitar producto"
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

    </div>
  )
}

export default Admin