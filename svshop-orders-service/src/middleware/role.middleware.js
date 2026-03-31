/**
 * Role Middleware
 * Verificación de roles para control de acceso
 */

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.rol) {
        return res.status(401).json({
          error: 'No autorizado',
          message: 'Usuario no autenticado'
        });
      }

      if (!allowedRoles.includes(req.user.rol)) {
        return res.status(403).json({
          error: 'Acceso denegado',
          message: `Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        error: 'Error del servidor',
        message: error.message
      });
    }
  };
};

module.exports = {
  checkRole
};
