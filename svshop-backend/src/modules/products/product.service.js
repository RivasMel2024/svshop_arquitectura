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

const update = async (productId, updateData, actor = {}) => {
  const product = await Product.findById(productId);

  if (!product) {
    return null;
  }

  const isSeller = actor.rol === 'VENDEDOR';
  const isOwner = product.vendedor && product.vendedor.toString() === actor.id;

  if (isSeller && !isOwner) {
    const error = new Error('No tienes permiso para editar este producto');
    error.statusCode = 403;
    throw error;
  }

  return await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true }
  );
};

const remove = async (productId, actor = {}) => {
  const product = await Product.findById(productId);

  if (!product) {
    return null;
  }

  const isSeller = actor.rol === 'VENDEDOR';
  const isOwner = product.vendedor && product.vendedor.toString() === actor.id;

  if (isSeller && !isOwner) {
    const error = new Error('No tienes permiso para deshabilitar este producto');
    error.statusCode = 403;
    throw error;
  }

  // Borrado lógico: marcamos como no disponible
  return await Product.findByIdAndUpdate(
    productId,
    {
      disponible: false,
      modificadoPor: actor.id || undefined
    },
    { new: true }
  );
};

const applyStockWithoutTransaction = async (items = [], actorId = null) => {
  const updated = [];

  for (const item of items) {
    const productId = item.producto;
    const quantity = Number(item.cantidad || 0);

    if (!productId || !quantity || quantity <= 0) {
      const error = new Error('Cada item debe incluir producto y cantidad válida');
      error.statusCode = 400;
      throw error;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        disponible: true,
        stock: { $gte: quantity }
      },
      {
        $inc: { stock: -quantity },
        ...(actorId ? { modificadoPor: actorId } : {})
      },
      { new: true }
    );

    if (!updatedProduct) {
      const existing = await Product.findById(productId);

      if (!existing) {
        const error = new Error(`Producto no encontrado: ${productId}`);
        error.statusCode = 404;
        throw error;
      }

      if (!existing.disponible) {
        const error = new Error(`Producto no disponible: ${existing.nombre}`);
        error.statusCode = 400;
        throw error;
      }

      const error = new Error(`Stock insuficiente para ${existing.nombre}. Disponible: ${existing.stock}, solicitado: ${quantity}`);
      error.statusCode = 400;
      throw error;
    }

    if (updatedProduct.stock <= 0 && updatedProduct.disponible) {
      updatedProduct.disponible = false;
      await updatedProduct.save();
    }

    updated.push({
      productId: updatedProduct._id,
      nombre: updatedProduct.nombre,
      stockActual: updatedProduct.stock,
      disponible: updatedProduct.disponible,
    });
  }

  return updated;
};

const applyCheckoutStock = async (items = [], actorId = null) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error('items debe ser un array no vacío');
    error.statusCode = 400;
    throw error;
  }

  const session = await Product.startSession();

  try {
    const updated = [];

    await session.withTransaction(async () => {
      for (const item of items) {
        const productId = item.producto;
        const quantity = Number(item.cantidad || 0);

        if (!productId || !quantity || quantity <= 0) {
          const error = new Error('Cada item debe incluir producto y cantidad válida');
          error.statusCode = 400;
          throw error;
        }

        const product = await Product.findById(productId).session(session);

        if (!product) {
          const error = new Error(`Producto no encontrado: ${productId}`);
          error.statusCode = 404;
          throw error;
        }

        if (!product.disponible) {
          const error = new Error(`Producto no disponible: ${product.nombre}`);
          error.statusCode = 400;
          throw error;
        }

        if (product.stock < quantity) {
          const error = new Error(`Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}, solicitado: ${quantity}`);
          error.statusCode = 400;
          throw error;
        }

        product.stock -= quantity;
        if (product.stock <= 0) {
          product.stock = 0;
          product.disponible = false;
        }

        if (actorId) {
          product.modificadoPor = actorId;
        }

        await product.save({ session });

        updated.push({
          productId: product._id,
          nombre: product.nombre,
          stockActual: product.stock,
          disponible: product.disponible,
        });
      }
    });

    return updated;
  } catch (error) {
    const isStandaloneMongo =
      error?.code === 20 ||
      error?.codeName === 'IllegalOperation' ||
      String(error?.message || '').includes('Transaction numbers are only allowed on a replica set member or mongos');

    if (!isStandaloneMongo) {
      throw error;
    }

    // Fallback para MongoDB standalone en desarrollo local
    return await applyStockWithoutTransaction(items, actorId);
  } finally {
    session.endSession();
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  applyCheckoutStock
};
