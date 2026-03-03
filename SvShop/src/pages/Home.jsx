import { ArrowRight, ShoppingCart, Truck, ShieldCheck, Clock } from "lucide-react"
import MOCK_PRODUCTS from "../data/products"
import Footer from "../components/Footer"

function Home({ navigate, onAddToCart }) {

  const categories = [
    { name: "Ropa", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { name: "Calzado", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { name: "Accesorios", image: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
    { name: "Tecnología", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" },
  ]

  const featuredProducts = MOCK_PRODUCTS.slice(0, 4)

  return (
    <div className="min-h-screen bg-[#FFF5F2] pb-12">

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-[#FDE4DD] rounded-3xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between relative">
          
          <div className="md:w-1/2 mb-8 md:mb-0">
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#CB6045] text-white text-xs font-bold mb-6">
              Nueva Colección 2026
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-black mb-6">
              Descubre tu estilo con <span className="text-[#F57656]">SVShop</span>
            </h1>

            <p className="text-[#5F6362] text-lg mb-8 max-w-md">
              Las mejores tendencias seleccionadas especialmente para ti.
            </p>

            <button 
              onClick={() => navigate('catalog')}
              className="bg-[#F57656] text-white px-8 py-4 rounded-full font-bold hover:bg-[#CB6045] transition flex items-center gap-2"
            >
              Comprar Ahora <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Hero Fashion" 
              className="w-64 h-80 md:w-80 md:h-[450px] object-cover rounded-[2.5rem] shadow-2xl border-4 border-white" 
            />
          </div>
        </div>
      </div>

      {/* PRODUCTOS DESTACADOS */}
      <div className="max-w-7xl mx-auto px-4 mt-24">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            Lo más vendido
          </h2>

          <button 
            onClick={() => navigate('catalog')} 
            className="text-[#CB6045] flex items-center gap-1 font-bold"
          >
            Ver todo <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col border border-gray-100 cursor-pointer"
              onClick={() => navigate('product')}
            >
              <div className="h-64 overflow-hidden bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>

                <p className="text-2xl font-black text-[#CB6045] mb-6">
                  ${product.price.toFixed(2)}
                </p>

                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddToCart(product)
                  }}
                  className="w-full bg-[#FDE4DD] text-[#A04A34] py-3.5 rounded-xl font-bold hover:bg-[#F57656] hover:text-white transition flex justify-center items-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />

    </div>
  )
}

export default Home