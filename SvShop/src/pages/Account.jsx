import { useState } from "react"
import { User, CreditCard, Package, X } from "lucide-react"

function Account() {

  const [user] = useState({
    name: "Allison Martínez",
    email: "allison@email.com",
    address: "San Salvador, El Salvador",
    memberSince: "2026-02-15",
    paymentMethods: [
      { id: 1, brand: "Visa", last4: "4242", exp: "08/28" },
      { id: 2, brand: "Mastercard", last4: "8899", exp: "01/27" }
    ],
    orders: [
      { id: 1024, total: 89.99, status: "Entregado" },
      { id: 1025, total: 45.00, status: "En camino" }
    ]
  })

  const [cards, setCards] = useState(user.paymentMethods)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvc: ""
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
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
              <p className="font-semibold">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Correo electrónico</p>
              <p className="font-semibold">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="font-semibold">{user.address}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Miembro desde</p>
              <p className="font-semibold capitalize">
                {formatDate(user.memberSince)}
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
            {user.orders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center bg-[#FFF5F2] p-4 rounded-xl"
              >
                <div>
                  <p className="font-semibold">
                    Pedido #{order.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${order.total.toFixed(2)}
                  </p>
                </div>

                <span className={`text-sm font-semibold px-4 py-1 rounded-full
                  ${order.status === "Entregado"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
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