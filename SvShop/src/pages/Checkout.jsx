import { useState, useEffect } from "react"
import { ArrowLeft, User, CreditCard } from "lucide-react"

function Checkout({ cartItems = [], navigate, clearCart }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("home")
    }
  }, [cartItems, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      clearCart()
      navigate("success")
    }, 2000)
  }

  if (cartItems.length === 0) return null

  // 💎 INPUT PREMIUM STYLE
  const inputStyle =
    "w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 " +
    "shadow-sm placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[#F57656]/40 focus:border-[#F57656] " +
    "transition-all duration-200"

  return (
    <div className="min-h-screen bg-[#FFF5F2] py-10">
      <div className="max-w-6xl mx-auto px-4">

        <button
          onClick={() => navigate("cart")}
          className="flex items-center gap-2 text-sm text-[#CB6045] mb-6 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al carrito
        </button>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* FORM */}
          <div className="lg:col-span-2">
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* ENVÍO */}
              <div className="bg-[#FDE4DD] rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <User className="h-6 w-6 text-[#CB6045]" />
                  Datos de Envío
                </h2>

                <div className="grid grid-cols-2 gap-5">
                  <input required placeholder="Nombre" className={inputStyle} />
                  <input required placeholder="Apellidos" className={inputStyle} />
                </div>

                <input
                  required
                  placeholder="Dirección completa"
                  className={`${inputStyle} mt-5`}
                />

                <div className="grid grid-cols-2 gap-5 mt-5">
                  <input required placeholder="Ciudad" className={inputStyle} />
                  <input required placeholder="Código Postal" className={inputStyle} />
                </div>
              </div>

              {/* PAGO */}
              <div className="bg-[#FCD6CC] rounded-3xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-[#A04A34]" />
                  Pago Seguro
                </h2>

                <input
                  required
                  placeholder="0000 0000 0000 0000"
                  className={inputStyle}
                />

                <div className="grid grid-cols-2 gap-5 mt-5">
                  <input required placeholder="MM/AA" className={inputStyle} />
                  <input required placeholder="CVC" className={inputStyle} />
                </div>
              </div>
            </form>
          </div>

          {/* RESUMEN */}
          <div>
            <div className="bg-white rounded-3xl p-6 shadow-md sticky top-24 border border-[#FDE4DD]">
              <h3 className="text-xl font-bold mb-6">Tu Pedido</h3>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex gap-2">
                      <span className="font-medium bg-gray-100 px-2 py-1 rounded text-xs">
                        {item.quantity}x
                      </span>
                      <span className="truncate w-32">
                        {item.name}
                      </span>
                    </div>

                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-2xl">
                  <span>Total</span>
                  <span className="text-[#F57656]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-[#F57656] text-white py-4 rounded-xl font-bold hover:bg-[#CB6045] transition disabled:opacity-70"
              >
                {isProcessing ? "Procesando..." : "Confirmar y Pagar"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout