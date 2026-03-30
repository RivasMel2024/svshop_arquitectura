import { ArrowLeft, ShoppingCart } from "lucide-react"

function ProductDetails({ product, navigate, onAddToCart }) {
  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF5F2] py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <h1 className="text-3xl font-bold text-black mb-4">No hay producto seleccionado</h1>
            <p className="text-gray-700 mb-8">Selecciona un producto desde el catálogo para ver sus detalles.</p>
            <button
              onClick={() => navigate('catalog')}
              className="bg-[#F57656] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#CB6045] transition"
            >
              Ir al catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F2] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('catalog')}
          className="flex items-center gap-2 text-sm text-[#CB6045] mb-8 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 h-96 md:h-auto bg-gray-100 relative">
            <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <button
              onClick={() => navigate('catalog')}
              className="w-fit mb-6 inline-flex items-center gap-2 rounded-full border border-[#FCD6CC] bg-[#FFF5F2] px-4 py-2 text-sm font-semibold text-[#CB6045] hover:bg-[#FDE4DD] transition"
            >
              <ArrowLeft className="h-4 w-4" /> Regresar al catálogo
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-extrabold text-[#F57656]">${product.price.toFixed(2)}</p>
              <span className={`px-4 py-1 rounded-full font-bold text-sm ${
                product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
              </span>
            </div>
            
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[#5F6362] uppercase tracking-wider mb-2">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <button 
              onClick={() => {
                onAddToCart(product);
              }}
              disabled={product.stock === 0}
              className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 ${
                product.stock > 0
                  ? "bg-[#F57656] text-white hover:bg-[#CB6045]"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="h-6 w-6" /> Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails