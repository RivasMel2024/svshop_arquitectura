import { useState, useRef, useEffect } from "react"
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Home as HomeIcon,
  Store as StoreIcon
} from "lucide-react"

function Navbar({ navigate, cartItemsCount, currentRoute }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchRef = useRef(null)

  const isActive = (route) => currentRoute === route

  // Cerrar búsqueda si se hace click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="bg-[#F57656] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("home")}
          >
            <span className="font-bold text-2xl tracking-wider">
              SV<span className="text-[#FDE4DD]">SHOP</span>
            </span>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-6">
            <button
              onClick={() => navigate("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                isActive("home")
                  ? "bg-[#CB6045] shadow-inner"
                  : "hover:bg-[#FDE4DD] hover:text-[#CB6045]"
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              <span className="font-semibold text-sm">Inicio</span>
            </button>

            <button
              onClick={() => navigate("catalog")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                isActive("catalog")
                  ? "bg-[#CB6045] shadow-inner"
                  : "hover:bg-[#FDE4DD] hover:text-[#CB6045]"
              }`}
            >
              <StoreIcon className="h-5 w-5" />
              <span className="font-semibold text-sm">Catálogo</span>
            </button>

            <button
              onClick={() => navigate("cart")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                isActive("cart") || isActive("checkout")
                  ? "bg-[#CB6045] shadow-inner"
                  : "hover:bg-[#FDE4DD] hover:text-[#CB6045]"
              }`}
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#7FEEF0] text-[#5F6362] text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="font-semibold text-sm">Carrito</span>
            </button>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden md:flex items-center space-x-4 relative">

            {/* SEARCH */}
            <div
              ref={searchRef}
              className="flex items-center relative transition-all duration-500"
            >
              <input
                type="text"
                placeholder="Buscar productos..."
                className={`absolute right-10 h-10 rounded-full text-[#5F6362]
                  focus:outline-none focus:ring-2 focus:ring-[#7FEEF0]
                  bg-white transition-all duration-500 ease-in-out
                  ${isSearchOpen
                    ? "w-64 opacity-100 px-4"
                    : "w-0 opacity-0 px-0"}
                `}
              />

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full bg-white text-[#F57656] hover:scale-105 transition shadow"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* ACCOUNT */}
            <button
              onClick={() => navigate("account")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 hover:bg-white hover:text-[#CB6045] transition"
            >
              <User className="h-5 w-5" />
              <span className="font-semibold text-sm">Mi Cuenta</span>
            </button>
          </div>

          {/* MOBILE */}
          <div className="md:hidden flex items-center space-x-3">
            <button className="p-2">
              <Search className="h-6 w-6" />
            </button>

            <button
              onClick={() => navigate("cart")}
              className="relative p-2"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#7FEEF0] text-[#5F6362] text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#CB6045] px-4 pt-4 pb-6 space-y-3 shadow-inner">
          <button
            onClick={() => {
              navigate("home")
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-4 w-full py-3 px-4 rounded-lg hover:bg-[#A04A34]"
          >
            <HomeIcon className="h-6 w-6" /> Inicio
          </button>

          <button
            onClick={() => {
              navigate("catalog")
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-4 w-full py-3 px-4 rounded-lg hover:bg-[#A04A34]"
          >
            <StoreIcon className="h-6 w-6" /> Catálogo
          </button>

          <button
            onClick={() => {
              navigate("cart")
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-4 w-full py-3 px-4 rounded-lg hover:bg-[#A04A34]"
          >
            <ShoppingCart className="h-6 w-6" /> Mi Carrito
          </button>

          <button
            onClick={() => {
              navigate("login")
              setIsMenuOpen(false)
            }}
            className="flex items-center gap-4 w-full py-3 px-4 rounded-lg hover:bg-[#A04A34] border-t border-[#F57656] mt-3 pt-4"
          >
            <User className="h-6 w-6" /> Mi Cuenta
          </button>
        </div>
      )}
    </nav>
  ) 
}

export default Navbar