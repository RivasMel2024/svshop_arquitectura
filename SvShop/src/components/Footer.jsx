import { Facebook, Instagram, Mail } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-[#FDE4DD] mt-16 border-t border-[#F8CFC4]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {/* Marca */}
        <div>
          <h3 className="text-2xl font-black text-[#CB6045] mb-3">
            SVShop
          </h3>
          <p className="text-sm text-[#5F6362] leading-relaxed">
            Tu tienda online con las últimas tendencias en moda,
            tecnología y accesorios. Compra fácil, rápido y seguro.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h4 className="font-bold mb-3">Tienda</h4>
          <ul className="space-y-2 text-sm text-[#5F6362]">
            <li className="hover:text-[#CB6045] cursor-pointer transition">
              Catálogo
            </li>
            <li className="hover:text-[#CB6045] cursor-pointer transition">
              Ofertas
            </li>
            <li className="hover:text-[#CB6045] cursor-pointer transition">
              Más vendidos
            </li>
          </ul>
        </div>

        {/* Ayuda */}
        <div>
          <h4 className="font-bold mb-3">Ayuda</h4>
          <ul className="space-y-2 text-sm text-[#5F6362]">
            <li className="hover:text-[#CB6045] cursor-pointer transition">
              Preguntas frecuentes
            </li>
            <li className="hover:text-[#CB6045] cursor-pointer transition">
              Política de devoluciones
            </li>
            <li className="hover:text-[#CB6045] cursor-pointer transition">
              Términos y condiciones
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="font-bold mb-3">Contacto</h4>

          <div className="flex items-center gap-3 text-sm text-[#5F6362] mb-3">
            <Mail className="h-4 w-4 text-[#CB6045]" />
            soporte@svshop.com
          </div>

          <div className="flex gap-4 mt-4">
            <Facebook className="h-5 w-5 text-[#CB6045] cursor-pointer hover:scale-110 transition" />
            <Instagram className="h-5 w-5 text-[#CB6045] cursor-pointer hover:scale-110 transition" />
          </div>
        </div>
      </div>

      <div className="border-t border-[#F8CFC4] text-center py-4 text-xs sm:text-sm text-[#5F6362]">
        © {new Date().getFullYear()} SVShop. Todos los derechos reservados.
      </div>
    </footer>
  )
}

export default Footer