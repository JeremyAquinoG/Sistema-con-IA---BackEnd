const User = require('../models/user');

exports.actualizarPerfil = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token
    const {
      nombres,
      apellidos,
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      genero,
      telefono,
      direccion,
      ocupacion
    } = req.body;

    await User.update({
      nombres,
      apellidos,
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      genero,
      telefono,
      direccion,
      ocupacion
    }, {
      where: { id: userId }
    });

    res.json({ msg: 'Perfil actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar perfil.', error: error.message });
  }
};
