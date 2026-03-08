/**
 * Product Controller
 * Responsabilidad: Recibir peticiones HTTP, validar entrada, delegar al servicio
 */

const productService = require('./product.service');

const getAllProducts = async (req, res, next) => {
  try {
    // TODO: Implementar listado con filtros (categoría, precio, disponibilidad) y paginación
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    // TODO: Implementar obtención de producto por ID
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    // TODO: Implementar creación de producto (validar imagen base64, límite 3MB)
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    // TODO: Implementar actualización de producto con auditoría
    res.status(501).json({ message: 'Not implemented' });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    // TODO: Implementar eliminación de producto
    res.status(501).json({ message: 'Not implemented' });
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
