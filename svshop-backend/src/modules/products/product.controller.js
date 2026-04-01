/**
 * Product Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */

const productService = require('./product.service');

// Helper para validar tamaño de imagen Base64 (límite 3MB)
const validarTamañoBase64 = (base64String, maxMB = 3) => {
  if (!base64String) return true;

  const partes = base64String.split(',');
  const soloBase64 = partes.length > 1 ? partes[1] : partes[0];

  const bytes = Math.ceil((soloBase64.length * 3) / 4);
  const megabytes = bytes / (1024 * 1024);

  return megabytes <= maxMB;
};

const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoria,
      minPrecio,
      maxPrecio,
      disponible
    } = req.query;

    const result = await productService.getAll(
      {
        categoria,
        minPrecio,
        maxPrecio,
        disponible
      },
      page,
      limit
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getById(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const data = req.body;

    // Validar imagen Base64 (límite 3MB)
    if (data.imagen && !validarTamañoBase64(data.imagen, 3)) {
      return res.status(400).json({ message: 'La imagen supera el límite permitido de 3MB' });
    }

    // Auditoría: tomamos el usuario autenticado del JWT
    const userId = req.user && req.user.id;

    const payload = {
      ...data,
      vendedor: userId,
      creadoPor: userId,
      modificadoPor: userId
    };

    const newProduct = await productService.create(payload);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.imagen && !validarTamañoBase64(data.imagen, 3)) {
      return res.status(400).json({ message: 'La nueva imagen supera el límite permitido de 3MB' });
    }

    const userId = req.user && req.user.id;
    const payload = {
      ...data,
      modificadoPor: userId
    };

    const updatedProduct = await productService.update(id, payload, req.user || {});

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productService.remove(id, req.user || {});

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
    }

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
