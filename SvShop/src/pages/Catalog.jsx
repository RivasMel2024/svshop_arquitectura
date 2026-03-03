import MOCK_PRODUCTS from "../data/products"

function Catalog({ navigate, onAddToCart, showToast }) {
  return (
    <div className="min-h-screen bg-[#FFF5F2] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-black mb-8 border-b-2 border-[#FCD6CC] pb-4">Nuestro Catálogo</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer" onClick={() => navigate('product', product.id)}>
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
                <p className="text-xl font-bold text-[#CB6045] mb-4">${product.price.toFixed(2)}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                    showToast("Producto agregado al carrito");
                  }}
                  className="w-full bg-[#FDE4DD] text-[#A04A34] py-2 rounded-lg font-medium hover:bg-[#F57656] hover:text-white transition"
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Catalog