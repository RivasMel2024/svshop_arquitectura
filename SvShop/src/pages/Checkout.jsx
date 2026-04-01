import { useState, useEffect } from "react"
import { ArrowLeft, User, CreditCard } from "lucide-react"
import toast from "react-hot-toast"
import { createOrder } from "../services/checkout.api"

function Checkout({ cartItems = [], navigate, clearCart, authToken = "", currentUser = null, onOrderCreated = null }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    numeroTarjeta: "",
    fechaVencimiento: "",
    cvc: "",
  })

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shippingCost = 10 // Costo de envío fijo
  const total = subtotal + shippingCost

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("home")
    }
  }, [cartItems, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que haya usuario autenticado
    if (!authToken || !currentUser?.id) {
      toast.error("Debes iniciar sesión para completar la compra")
      navigate("login")
      return
    }

    // Validar que el formulario esté completo
    if (
      !formData.nombre ||
      !formData.apellidos ||
      !formData.direccion ||
      !formData.ciudad ||
      !formData.codigoPostal ||
      !formData.telefono ||
      !formData.numeroTarjeta ||
      !formData.fechaVencimiento ||
      !formData.cvc
    ) {
      toast.error("Por favor completa todos los campos")
      return
    }

    setIsProcessing(true)

    try {
      // Llamar al API para crear la orden
      const order = await createOrder({
        cartItems,
        total,
        subtotal,
        token: authToken,
        shippingData: formData,
      })

      // Indicar éxito
      toast.success("¡Orden creada exitosamente!")

      // Refrescar órdenes si hay callback
      if (onOrderCreated) {
        await onOrderCreated()
      }

      // Limpiar carrito y navegar a success
      clearCart()
      navigate("success")
    } catch (error) {
      toast.error(error.message || "Error al crear la orden. Intenta de nuevo.")
      console.error("Error creando orden:", error)
    } finally {
      setIsProcessing(false)
    }
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
                  <input
                    required
                    placeholder="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                  <input
                    required
                    placeholder="Apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                </div>

                <input
                  required
                  placeholder="Dirección completa"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className={`${inputStyle} mt-5`}
                />

                <div className="grid grid-cols-2 gap-5 mt-5">
                  <input
                    required
                    placeholder="Ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                  <input
                    required
                    placeholder="Código Postal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                </div>

                <input
                  required
                  placeholder="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={`${inputStyle} mt-5`}
                />
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
                  name="numeroTarjeta"
                  value={formData.numeroTarjeta}
                  onChange={handleInputChange}
                  maxLength="19"
                  className={inputStyle}
                />

                <div className="grid grid-cols-2 gap-5 mt-5">
                  <input
                    required
                    placeholder="MM/AA"
                    name="fechaVencimiento"
                    value={formData.fechaVencimiento}
                    onChange={handleInputChange}
                    maxLength="5"
                    className={inputStyle}
                  />
                  <input
                    required
                    placeholder="CVC"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    maxLength="4"
                    className={inputStyle}
                  />
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

              <div className="border-t pt-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span >Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl mt-2">
                  <span>Total</span>
                  <span className="text-[#F57656]">
                    ${total.toFixed(2)}
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