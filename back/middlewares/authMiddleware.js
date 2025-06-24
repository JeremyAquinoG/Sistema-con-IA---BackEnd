const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o malformado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjunta la info decodificada del token al request
    req.user = decoded;

    // (Opcional) muestra por consola para verificar
    console.log('Token verificado. Usuario:', decoded);

    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authMiddleware;
