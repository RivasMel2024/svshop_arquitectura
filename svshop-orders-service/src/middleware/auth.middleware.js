const jwt = require('jsonwebtoken');
const env = require('../config/config');

const verifyToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No autorizado',
        message: 'Token no proporcionado' 
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar y decodificar token
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Agregar información del usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'No autorizado',
        message: 'Token inválido' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'No autorizado',
        message: 'Token expirado' 
      });
    }
    return res.status(500).json({ 
      error: 'Error del servidor',
      message: error.message 
    });
  }
};

module.exports = {
  verifyToken
};
