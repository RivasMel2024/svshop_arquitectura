import { CheckCircle } from "lucide-react"

function OrderSuccess({ navigate }) {
  return (
    <div className="min-h-screen bg-[#FFF5F2] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-md">
        
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />

        <h1 className="text-3xl font-bold mb-4">
          ¡Pedido confirmado! 🎉
        </h1>

        <p className="text-gray-600 mb-8">
          Gracias por tu compra en SVShop.
          Te enviaremos un correo con los detalles.
        </p>

        <button
          onClick={() => navigate("home")}
          className="bg-[#F57656] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#CB6045] transition"
        >
          Volver al inicio
        </button>

      </div>
    </div>
  )
}

export default OrderSuccess