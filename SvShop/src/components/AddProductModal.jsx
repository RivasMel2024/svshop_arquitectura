import { useState, useRef } from "react"
import { X, Upload } from "lucide-react"
import toast from "react-hot-toast"
import { createProduct } from "../services/products.api"

function AddProductModal({ isOpen, onClose, onProductAdded, authToken, currentUser }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "Ropa",
    stock: "1"
  })

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño (max 3MB)
    const maxSizeMB = 3
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast.error(`Imagen debe ser menor a ${maxSizeMB}MB`)
      return
    }

    // Validar que sea imagen
    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen")
      return
    }

    // Convertir a base64 con FileReader API (nativo del navegador)
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64String = event.target.result
      // Extraer solo la parte base64 (sin data:image/...;base64,)
      const base64WithoutPrefix = base64String.split(",")[1]
      setImageBase64(base64WithoutPrefix)
      setImagePreview(base64String) // Para mostrar preview
      toast.success("Imagen cargada ✓")
    }
    reader.onerror = () => {
      toast.error("Error al leer la imagen")
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que sea VENDEDOR
    if (!currentUser || currentUser.rol !== "VENDEDOR") {
      toast.error("Solo los vendedores pueden agregar productos")
      onClose()
      return
    }

    // Validar campos requeridos
    if (!formData.nombre.trim()) {
      toast.error("El nombre del producto es requerido")
      return
    }

    if (!formData.precio || Number(formData.precio) <= 0) {
      toast.error("El precio debe ser mayor a 0")
      return
    }

    if (!authToken) {
      toast.error("Debes estar autenticado para crear productos")
      return
    }

    setIsLoading(true)

    try {
      await createProduct(
        {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: Number(formData.precio),
          categoria: formData.categoria,
          stock: Number(formData.stock),
          imagen: imageBase64 || null // Si no hay imagen, envía null
        },
        authToken
      )

      toast.success("Producto creado exitosamente 🎉")
      
      // Resetear formulario
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "Ropa",
        stock: "1"
      })
      setImageBase64(null)
      setImagePreview(null)
      
      // Callback para actualizar lista
      if (onProductAdded) {
        onProductAdded()
      }
      
      onClose()
    } catch (error) {
      toast.error(error.message || "Error creando producto")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 " +
    "placeholder:text-gray-400 " +
    "focus:outline-none focus:ring-2 focus:ring-[#F57656]/40 focus:border-[#F57656] " +
    "transition-all duration-200"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center p-8 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Crear Nuevo Producto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* IMAGEN */}
          <div>
            <label className="block text-sm font-semibold mb-3">Foto del Producto</label>
            
            {/* Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border-2 border-[#F57656]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    setImageBase64(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#F57656] transition bg-gray-50"
            >
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">
                {imagePreview ? "Cambiar imagen" : "Sube una imagen"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Máximo 3MB</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* NOMBRE */}
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Camiseta Básica de Algodón"
              className={inputStyle}
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="block text-sm font-semibold mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Detalles del producto..."
              rows="4"
              className={`${inputStyle} resize-none`}
            />
          </div>

          {/* PRECIO Y STOCK */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Precio *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                placeholder="99.99"
                step="0.01"
                min="0"
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="1"
                min="0"
                className={inputStyle}
              />
            </div>
          </div>

          {/* CATEGORÍA */}
          <div>
            <label className="block text-sm font-semibold mb-2">Categoría</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              className={inputStyle}
            >
              <option value="Ropa">Ropa</option>
              <option value="Calzado">Calzado</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Tecnología">Tecnología</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl bg-[#F57656] text-white font-semibold hover:bg-[#CB6045] transition disabled:opacity-70"
            >
              {isLoading ? "Creando..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductModal
