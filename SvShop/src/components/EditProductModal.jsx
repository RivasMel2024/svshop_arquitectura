import { useEffect, useRef, useState } from "react"
import { X, Upload } from "lucide-react"
import toast from "react-hot-toast"
import { updateProduct } from "../services/products.api"

function EditProductModal({ isOpen, onClose, product, authToken, currentUser, onProductUpdated }) {
  const fileInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageBase64, setImageBase64] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "Ropa",
    stock: "0"
  })

  useEffect(() => {
    if (!product) return

    setFormData({
      nombre: product.name || "",
      descripcion: product.description || "",
      precio: String(product.price ?? ""),
      categoria: product.category || "Ropa",
      stock: String(product.stock ?? 0)
    })
    setImagePreview(product.image || null)
    setImageBase64("")
  }, [product])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSizeMB = 3
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.size > maxSizeBytes) {
      toast.error(`Imagen debe ser menor a ${maxSizeMB}MB`)
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const fullBase64 = event.target.result
      const base64WithoutPrefix = fullBase64.split(",")[1]
      setImageBase64(base64WithoutPrefix)
      setImagePreview(fullBase64)
      toast.success("Imagen actualizada")
    }
    reader.onerror = () => {
      toast.error("Error al leer la imagen")
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!product?.id) {
      toast.error("Producto inválido")
      return
    }

    const userRole = currentUser?.rol || currentUser?.role
    if (userRole !== "VENDEDOR") {
      toast.error("Solo vendedores pueden editar productos")
      return
    }

    if (currentUser?.id !== product?.sellerId) {
      toast.error("Solo puedes editar tus propios productos")
      return
    }

    if (!formData.nombre.trim()) {
      toast.error("El nombre del producto es requerido")
      return
    }

    if (!formData.precio || Number(formData.precio) <= 0) {
      toast.error("El precio debe ser mayor a 0")
      return
    }

    setIsLoading(true)

    try {
      await updateProduct(
        product.id,
        {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: Number(formData.precio),
          categoria: formData.categoria,
          stock: Number(formData.stock),
          imagen: imageBase64 || undefined
        },
        authToken
      )

      toast.success("Producto actualizado correctamente")

      if (onProductUpdated) {
        await onProductUpdated()
      }

      onClose()
    } catch (error) {
      toast.error(error.message || "Error actualizando producto")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen || !product) return null

  const inputStyle =
    "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F57656]/40 " +
    "focus:border-[#F57656] transition-all duration-200"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-8 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Editar Producto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Foto del Producto</label>

            {imagePreview && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border-2 border-[#F57656]"
                />
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#F57656] transition bg-gray-50"
            >
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">Cambiar imagen</p>
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

          <div>
            <label className="block text-sm font-semibold mb-2">Nombre *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows="4"
              className={`${inputStyle} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Precio *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
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
                min="0"
                className={inputStyle}
              />
            </div>
          </div>

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
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProductModal
