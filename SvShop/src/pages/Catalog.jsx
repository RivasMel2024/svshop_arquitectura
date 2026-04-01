import { useState } from "react"

function Catalog({ navigate, products = [], loading = false, error = "", onAddToCart, onViewProduct }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  // Obtener categorías únicas ordenadas alfabéticamente
  const categories = ["Todas las categorías", ...Array.from(new Set(products.map(p => p.category))).sort()]
  
  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory && selectedCategory !== "Todas las categorías"
    ? products.filter(p => p.category === selectedCategory)
    : products

  return (
    <div className="min-h-screen bg-[#FFF5F2] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-6 border-b-2 border-[#FCD6CC] pb-4">Nuestro Catálogo</h1>
          
          {/* Menú de Categorías */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === "Todas las categorías" ? null : cat)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  (selectedCategory === null && cat === "Todas las categorías") || selectedCategory === cat
                    ? "bg-[#F57656] text-white"
                    : "bg-[#FDE4DD] text-[#A04A34] hover:bg-[#F57656] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Cargando productos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-12">
            <p className="text-xl text-red-600 mb-6">{error}</p>
          </div>
        )}

        {/* Mostrar mensaje si no hay productos en la categoría */}
        {!loading && !error && filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-6">No hay productos disponibles en esta categoría</p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="bg-[#F57656] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#CB6045] transition"
            >
              Ver todos los productos
            </button>
          </div>
        ) : !loading && !error ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer" onClick={() => onViewProduct(product)}>
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">{product.name}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    product.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
                  </span>
                </div>
                <p className="text-xl font-bold text-[#CB6045] mb-4">${product.price.toFixed(2)}</p>
                <button
                  disabled={product.stock === 0} 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className={`w-full py-2 rounded-lg font-medium transition ${
                    product.stock > 0
                      ? "bg-[#FDE4DD] text-[#A04A34] hover:bg-[#F57656] hover:text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Catalog