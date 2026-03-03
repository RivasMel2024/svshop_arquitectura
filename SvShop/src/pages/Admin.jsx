import { useState } from "react"
import {
  Users,
  Package,
  Settings,
  LifeBuoy,
  Trash2,
  UserX,
  Plus
} from "lucide-react"

function Admin() {
  const [activeTab, setActiveTab] = useState("users")

  // 🔹 Mock Usuarios
  const [users, setUsers] = useState([
    { id: 1, name: "Allison Martínez", email: "allison@email.com", active: true },
    { id: 2, name: "Carlos Pérez", email: "carlos@email.com", active: true },
    { id: 3, name: "María López", email: "maria@email.com", active: false }
  ])

  // 🔹 Mock Productos
  const [products, setProducts] = useState([
    { id: 1, name: "Vestido Floral", price: 45 },
    { id: 2, name: "Zapatos Urban", price: 60 },
    { id: 3, name: "Bolso Elegante", price: 35 }
  ])

  // 🔹 Mock Tickets Soporte
  const [tickets] = useState([
    { id: 101, user: "Allison", issue: "No puedo pagar", status: "Pendiente" },
    { id: 102, user: "Carlos", issue: "Producto defectuoso", status: "Resuelto" }
  ])

  // 🔹 Deshabilitar Usuario
  const toggleUserStatus = (id) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    )
  }

  // 🔹 Eliminar Producto
  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#FFF5F2] flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#F57656] text-white p-6 space-y-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
            activeTab === "users" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <Users className="h-5 w-5" /> Usuarios
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition ${
            activeTab === "products" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <Package className="h-5 w-5" /> Productos
        </button>

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
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-8">Panel Administrativo</h1>

        {/* ================= USERS ================= */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex justify-between items-center p-4 bg-[#FFF5F2] rounded-xl"
                >
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
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
                      onClick={() => toggleUserStatus(user.id)}
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:scale-105 transition"
                    >
                      <UserX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PRODUCTS ================= */}
        {activeTab === "products" && (
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 flex justify-between items-center">
              Gestión de Productos
              <button className="flex items-center gap-2 bg-[#F57656] text-white px-4 py-2 rounded-xl hover:bg-[#CB6045] transition">
                <Plus className="h-4 w-4" />
                Agregar
              </button>
            </h2>

            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-4 bg-[#FFF5F2] rounded-xl"
                >
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-500">${product.price}</p>
                  </div>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:scale-105 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SUPPORT ================= */}
        {activeTab === "support" && (
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
        {activeTab === "system" && (
          <div className="bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Monitor del Sistema</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#FDE4DD] p-6 rounded-2xl">
                <p className="text-sm text-gray-600">Usuarios Activos</p>
                <p className="text-3xl font-bold">
                  {users.filter((u) => u.active).length}
                </p>
              </div>

              <div className="bg-[#FCD6CC] p-6 rounded-2xl">
                <p className="text-sm text-gray-600">Productos Totales</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>

              <div className="bg-[#FFF5F2] p-6 rounded-2xl">
                <p className="text-sm text-gray-600">Tickets Pendientes</p>
                <p className="text-3xl font-bold">
                  {tickets.filter((t) => t.status === "Pendiente").length}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Admin