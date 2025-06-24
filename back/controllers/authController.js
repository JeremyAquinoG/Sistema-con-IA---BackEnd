const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Asegúrate que la ruta esté correcta
const Log = require('../models/log');   // Asegúrate que la ruta esté correcta

// 📌 REGISTRO
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña requeridos.' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    // 🟩 Log para el registro
    await Log.create({
      user_id: newUser.id,
      accion: 'Registro',
      detalle: `Usuario '${newUser.username}' se registró.`
    });

    res.status(201).json({ message: 'Usuario registrado con éxito!' });

  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// 🔐 LOGIN
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 🟩 Log para el login (después de verificar y antes de salir del try)
    await Log.create({
      user_id: user.id,
      accion: 'Inicio de sesión',
      detalle: `Usuario '${user.username}' inició sesión.`
    });

    res.status(200).json({
      message: 'Login exitoso!',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};
