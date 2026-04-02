import { useState } from "react"
import {
  Package,
  Trash2,
  BarChart3,
  ShoppingBag,
  Plus,
  Edit
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

function Vendor() {

  const [activeTab, setActiveTab] = useState("inventory")
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Vestido Floral",
      price: 45,
      stock: 12,
      image: "./vestidofloral.avif"
    },
    {
      id: 2,
      name: "Zapatos Urban",
      price: 60,
      stock: 3,
      image: "./zapatosurban.jpeg"
    },
    {
      id: 3,
      name: "Bolso Elegante",
      price: 35,
      stock: 7,
      image: "./bolsoelegante.jpg"
    }
  ])

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: ""
  })

  const sales = [
    { id: 1, product: "Vestido Floral", amount: 45, date: "2026-03-10" },
    { id: 2, product: "Bolso Elegante", amount: 35, date: "2026-03-11" },
    { id: 3, product: "Zapatos Urban", amount: 60, date: "2026-03-12" }
  ]

  const salesData = [
    { month: "Ene", sales: 200 },
    { month: "Feb", sales: 350 },
    { month: "Mar", sales: 420 },
    { month: "Abr", sales: 300 },
    { month: "May", sales: 500 }
  ]

  const openCreateModal = () => {
    setEditingProduct(null)
    setForm({
      name: "",
      price: "",
      stock: "",
      image: ""
    })
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setForm(product)
    setShowModal(true)
  }

  const saveProduct = () => {

    if (!form.name || !form.price || !form.stock) return

    if (editingProduct) {

      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...form, id: editingProduct.id } : p
        )
      )

    } else {

      const newProduct = {
        ...form,
        id: Date.now()
      }

      setProducts([...products, newProduct])
    }

    setShowModal(false)
  }

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-[#FFF5F2] flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#F57656] text-white p-6 space-y-6 hidden md:block">

        <h2 className="text-2xl font-bold mb-8">Vendor Panel</h2>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl ${
            activeTab === "inventory" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <Package className="h-5 w-5" /> Inventario
        </button>

        <button
          onClick={() => setActiveTab("sales")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl ${
            activeTab === "sales" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <ShoppingBag className="h-5 w-5" /> Ventas
        </button>

        <button
          onClick={() => setActiveTab("stats")}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl ${
            activeTab === "stats" ? "bg-[#CB6045]" : "hover:bg-[#CB6045]"
          }`}
        >
          <BarChart3 className="h-5 w-5" /> Estadísticas
        </button>

      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-8">Panel del Vendedor</h1>

        {/* INVENTORY */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-3xl shadow p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">Mi Inventario</h2>

              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-[#F57656] text-white px-4 py-2 rounded-xl hover:bg-[#CB6045]"
              >
                <Plus className="h-4 w-4" />
                Agregar Producto
              </button>

            </div>

            <div className="grid md:grid-cols-3 gap-6">

              {products.map((product) => (

                <div
                  key={product.id}
                  className="bg-[#FFF5F2] p-4 rounded-xl"
                >

                  <img
                    src={product.image || "https://picsum.photos/200"}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />

                  <h3 className="font-semibold">{product.name}</h3>

                  <p className="text-sm text-gray-500">
                    ${product.price}
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      product.stock < 5
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    Stock: {product.stock}
                  </p>

                  {product.stock < 5 && (
                    <p className="text-xs text-red-500">
                      ⚠ Stock bajo
                    </p>
                  )}

                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-yellow-100 rounded-lg"
                    >
                      <Edit className="h-4 w-4 text-yellow-700" />
                    </button>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 bg-red-100 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>
        )}

        {/* SALES */}
        {activeTab === "sales" && (
          <div className="bg-white rounded-3xl shadow p-8">

            <h2 className="text-2xl font-bold mb-6">Ventas Recientes</h2>

            <div className="space-y-4">

              {sales.map((sale) => (

                <div
                  key={sale.id}
                  className="flex justify-between bg-[#FFF5F2] p-4 rounded-xl"
                >

                  <div>
                    <p className="font-semibold">{sale.product}</p>
                    <p className="text-sm text-gray-500">{sale.date}</p>
                  </div>

                  <p className="font-bold text-[#CB6045]">
                    ${sale.amount}
                  </p>

                </div>

              ))}

            </div>

          </div>
        )}

        {/* STATS */}
        {activeTab === "stats" && (
          <div className="space-y-8">

            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-sm text-gray-500">Ventas Totales</p>
                <p className="text-3xl font-bold">$970</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-sm text-gray-500">Productos</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-sm text-gray-500">Productos Vendidos</p>
                <p className="text-3xl font-bold">{sales.length}</p>
              </div>

            </div>

            <div className="bg-white p-8 rounded-3xl shadow">

              <h2 className="text-xl font-bold mb-6">
                Ventas por Mes
              </h2>

              <ResponsiveContainer width="100%" height={300}>

                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#F57656"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>
        )}

      </div>

      {/* MODAL PRODUCTO */}
      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-8 rounded-2xl w-full max-w-md space-y-4">

            <h2 className="text-xl font-bold">
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h2>

            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              placeholder="Precio"
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <input
              placeholder="URL Imagen"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={saveProduct}
                className="px-4 py-2 bg-[#F57656] text-white rounded"
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Vendor