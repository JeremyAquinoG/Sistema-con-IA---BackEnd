const User = require('../models/user');


// OBTENER PERFIL DEL USUARIO
exports.obtenerPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const usuario = await User.findByPk(userId, {
      attributes: [
        'id',
        'nombres',
        'apellidos',
        'tipo_documento',
        'numero_documento',
        'fecha_nacimiento',
        'genero',
        'telefono',
        'direccion',
        'ocupacion',
        'email',
        'username'
      ]
    });

    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener perfil.', error: error.message });
  }
};

// ACTUALIZAR PERFIL (cuando ya existe)
exports.actualizarPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
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

    const [updated] = await User.update({
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

    if (updated === 0) {
      return res.status(404).json({ msg: 'Perfil no encontrado para actualizar.' });
    }

    res.json({ msg: 'Perfil actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar perfil.', error: error.message });
  }
};

// CREAR PERFIL (primera vez después del login)
exports.crearPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
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

    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Solo si los datos están vacíos
    if (
      usuario.nombres || usuario.apellidos || usuario.tipo_documento || usuario.numero_documento
    ) {
      return res.status(400).json({ msg: 'El perfil ya fue creado previamente.' });
    }

    await usuario.update({
      nombres,
      apellidos,
      tipo_documento,
      numero_documento,
      fecha_nacimiento,
      genero,
      telefono,
      direccion,
      ocupacion
    });

    res.status(200).json({ msg: 'Perfil creado correctamente.' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear perfil.', error: error.message });
  }

  


};
