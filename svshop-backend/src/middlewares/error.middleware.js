/**
 * Error Middleware
 * Manejo global de errores
 */

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Error de validación',
      message: errors
    });
  }

  // Error de duplicado (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      error: 'Error de duplicado',
      message: `El ${field} ya existe`
    });
  }

  // Error de casting (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Error de formato',
      message: 'ID inválido'
    });
  }

  // Payload demasiado grande (body-parser)
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'PayloadTooLargeError',
      message: 'El body enviado es demasiado grande. Para imágenes, usa máximo 3MB por archivo.'
    });
  }

  // Error por defecto
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: err.name || 'Error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
