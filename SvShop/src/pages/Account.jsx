import { useState } from "react"
import { User, CreditCard, Package, X } from "lucide-react"

const ORDER_STATUS_LABEL = {
  PENDIENTE: "Pendiente",
  EN_CAMINO: "En camino",
  RECIBIDA: "Recibida",
  CANCELADA: "Cancelada"
}

function Account({ user, orders = [], ordersLoading = false, ordersError = "" }) {
  const [cards, setCards] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvc: ""
  })

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible"
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return "No disponible"
    return date.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric"
    })
  }

  const detectBrand = (number) => {
    if (number.startsWith("4")) return "Visa"
    if (number.startsWith("5")) return "Mastercard"
    return "Tarjeta"
  }

  const handleAddCard = () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvc) return

    const last4 = newCard.number.slice(-4)
    const brand = detectBrand(newCard.number)

    setCards([
      ...cards,
      {
        id: Date.now(),
        brand,
        last4,
        exp: newCard.expiry
      }
    ])

    setNewCard({ number: "", expiry: "", cvc: "" })
    setIsModalOpen(false)
  }

  const formatMoney = (value) => {
    const amount = Number(value || 0)
    return amount.toFixed(2)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF5F2] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-black mb-4">Mi Cuenta</h1>
            <p className="text-gray-700 mb-6">No hay sesión activa. Inicia sesión para ver tu perfil.</p>
            <button
              onClick={() => navigate("login")}
              className="bg-[#F57656] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#CB6045] transition"
            >
              Ir a iniciar sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF5F2] py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-10">

        {/* 🔹 TÍTULO */}
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">
            Mi Cuenta
          </h1>
          <p className="text-gray-600">
            Gestiona tu información y pedidos
          </p>
        </div>

        {/* 👤 INFORMACIÓN PERSONAL */}
        <div className="bg-[#FDE4DD] rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="h-6 w-6 text-[#CB6045]" />
            Información Personal
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="font-semibold">{user.nombre}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Correo electrónico</p>
              <p className="font-semibold">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="font-semibold">No registrada</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Miembro desde</p>
              <p className="font-semibold capitalize">
                {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* 💳 MÉTODOS DE PAGO */}
        <div className="bg-[#FCD6CC] rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-[#A04A34]" />
            Métodos de Pago
          </h2>

          <div className="space-y-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {card.brand} •••• {card.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expira {card.exp}
                  </p>
                </div>

                <span className="text-xs bg-[#FDE4DD] text-[#CB6045] px-3 py-1 rounded-full font-semibold">
                  Guardada
                </span>
              </div>
            ))}

            {cards.length === 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600">Aún no tienes métodos de pago guardados.</p>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 w-full border-2 border-dashed border-[#CB6045] text-[#CB6045] py-3 rounded-xl font-semibold hover:bg-[#CB6045] hover:text-white transition"
            >
              + Agregar método de pago
            </button>
          </div>
        </div>

        {/* 📦 HISTORIAL DE PEDIDOS */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-[#FDE4DD]">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package className="h-6 w-6 text-[#F57656]" />
            Historial de Pedidos
          </h2>

          <div className="space-y-4">
            {ordersLoading && (
              <div className="flex justify-between items-center bg-[#FFF5F2] p-4 rounded-xl">
                <p className="text-sm text-gray-600">Cargando historial...</p>
              </div>
            )}

            {!ordersLoading && ordersError && (
              <div className="flex justify-between items-center bg-[#FFF5F2] p-4 rounded-xl">
                <p className="text-sm text-red-600">{ordersError}</p>
              </div>
            )}

            {!ordersLoading && !ordersError && orders.length === 0 && (
              <div className="flex justify-between items-center bg-[#FFF5F2] p-4 rounded-xl">
                <div>
                  <p className="font-semibold">Aún no tienes pedidos</p>
                  <p className="text-sm text-gray-500">Cuando hagas tu primera compra, aparecerá aquí.</p>
                </div>
              </div>
            )}

            {!ordersLoading && !ordersError && orders.map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center bg-[#FFF5F2] p-4 rounded-xl"
              >
                <div>
                  <p className="font-semibold">Pedido #{order.numeroOrden || order._id}</p>
                  <p className="text-sm text-gray-500">${formatMoney(order?.totales?.total)}</p>
                </div>

                <span className={`text-sm font-semibold px-4 py-1 rounded-full ${
                  order.estado === "RECIBIDA"
                    ? "bg-green-100 text-green-700"
                    : order.estado === "CANCELADA"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {ORDER_STATUS_LABEL[order.estado] || order.estado || "Pendiente"}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 🔥 MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-6">
              Agregar tarjeta
            </h2>

            <input
              type="text"
              placeholder="Número de tarjeta"
              value={newCard.number}
              onChange={(e) =>
                setNewCard({ ...newCard, number: e.target.value })
              }
              className="w-full border border-gray-300 px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#F57656]"
            />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="MM/AA"
                value={newCard.expiry}
                onChange={(e) =>
                  setNewCard({ ...newCard, expiry: e.target.value })
                }
                className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F57656]"
              />

              <input
                type="text"
                placeholder="CVC"
                value={newCard.cvc}
                onChange={(e) =>
                  setNewCard({ ...newCard, cvc: e.target.value })
                }
                className="border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F57656]"
              />
            </div>

            <button
              onClick={handleAddCard}
              className="w-full bg-[#F57656] text-white py-3 rounded-xl font-bold hover:bg-[#CB6045] transition"
            >
              Guardar tarjeta
            </button>

          </div>
        </div>
      )}
    </div>
  )
}

export default Account