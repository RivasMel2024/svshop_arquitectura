import { useState } from "react"
import { ShoppingCart, Minus, Plus, Trash2, AlertCircle, X } from "lucide-react"

function Cart({ cartItems = [], updateQuantity, removeItem, navigate }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDeleteClick = (item) => {
    setDeleteConfirm(item)
  }

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      removeItem(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteConfirm(null)
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-[#FFF5F2] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black mb-8 border-b-2 border-[#FCD6CC] pb-4">
          Tu Carrito
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <ShoppingCart className="h-20 w-20 text-[#FDE4DD] mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-[#5F6362] mb-8">
              ¡Parece que aún no has agregado nada!
            </p>
            <button
              onClick={() => navigate("home")}
              className="bg-[#F57656] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#CB6045] transition"
            >
              Ir de compras
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Items */}
            <div className="lg:w-2/3 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-[#CB6045] font-bold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 bg-[#FDE4DD] rounded-lg p-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1 hover:bg-white rounded-md text-[#A04A34] transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-6 text-center font-medium text-black">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="p-1 hover:bg-white rounded-md text-[#A04A34] transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition ml-2"
                    title="Eliminar producto"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl p-6 shadow-md sticky top-24">
                <h3 className="text-xl font-bold text-black mb-6">
                  Resumen del pedido
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#5F6362]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-[#5F6362]">
                    <span>Envío</span>
                    <span className="text-green-500 font-medium">
                      Gratis
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-xl text-black">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("checkout")}
                  className="w-full bg-[#F57656] text-white py-4 rounded-xl font-bold hover:bg-[#CB6045] transition shadow-md"
                >
                  Proceder al Pago
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-300 scale-100 animate-scale-up">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  ¿Eliminar producto?
                </h3>
                <p className="text-gray-600">
                  Se eliminará <span className="font-semibold text-[#F57656]">{deleteConfirm.name}</span> del carrito
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2 group"
                >
                  <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart