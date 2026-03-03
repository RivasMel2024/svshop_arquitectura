import { ArrowLeft, ShoppingCart } from "lucide-react"

function ProductDetails({ product, navigate, onAddToCart, showToast }) {
  if (!product) return null;

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
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">{product.name}</h1>
            <p className="text-3xl font-extrabold text-[#F57656] mb-6">${product.price.toFixed(2)}</p>
            
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-[#5F6362] uppercase tracking-wider mb-2">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            <button 
              onClick={() => {
                onAddToCart(product);
                showToast("Producto agregado al carrito");
              }}
              className="w-full md:w-auto bg-[#F57656] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#CB6045] transition shadow-lg flex items-center justify-center gap-2"
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