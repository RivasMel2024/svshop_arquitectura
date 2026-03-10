/**
 * Product Service
 * Responsabilidad: Contiene TODA la lógica de negocio de productos
 */

const Product = require('./product.model');

const getAll = async (filters = {}, page = 1, limit = 10) => {
  const query = {};

  // Filtros de catálogo
  if (filters.categoria) {
    query.categoria = filters.categoria;
  }

  if (filters.disponible !== undefined) {
    // Puede venir como string desde query params
    if (typeof filters.disponible === 'string') {
      query.disponible = filters.disponible === 'true';
    } else {
      query.disponible = !!filters.disponible;
    }
  }

  // Rango de precios
  if (filters.minPrecio || filters.maxPrecio) {
    query.precio = {};
    if (filters.minPrecio !== undefined) {
      query.precio.$gte = Number(filters.minPrecio);
    }
    if (filters.maxPrecio !== undefined) {
      query.precio.$lte = Number(filters.maxPrecio);
    }
  }

  // Paginación (forzar a 10 o 20)
  const parsedLimit = Number(limit);
  const limitNumber = [10, 20].includes(parsedLimit) ? parsedLimit : 10;
  const pageNumber = Math.max(1, Number(page) || 1);
  const skip = (pageNumber - 1) * limitNumber;

  const [productos, total] = await Promise.all([
    Product.find(query)
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 })
      .populate('vendedor', 'nombre email')
      .populate('creadoPor', 'nombre email')
      .populate('modificadoPor', 'nombre email')
      .exec(),
    Product.countDocuments(query)
  ]);

  return {
    productos,
    paginacion: {
      total,
      paginaActual: pageNumber,
      totalPaginas: Math.ceil(total / limitNumber),
      limite: limitNumber
    }
  };
};

const getById = async (productId) => {
  return await Product.findById(productId)
    .populate('vendedor', 'nombre email')
    .populate('creadoPor', 'nombre email')
    .populate('modificadoPor', 'nombre email');
};

const create = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

const update = async (productId, updateData) => {
  return await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true }
  );
};

const remove = async (productId) => {
  // Borrado lógico: marcamos como no disponible
  return await Product.findByIdAndUpdate(
    productId,
    { disponible: false },
    { new: true }
  );
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
