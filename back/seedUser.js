// seedUser.js
const bcrypt = require('bcryptjs');
const db = require('./coneccion/db');
const User = require('./models/user'); // Asegúrate de que la ruta es correcta

async function createUser() {
  const username = "admin";
  const password = "admin";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.sync();
    const newUser = await User.create({
      username: username,
      password: hashedPassword
    });
    console.log('Usuario creado con éxito:', newUser);
  } catch (error) {
    console.error('Error al crear el usuario:', error);
  }
}

createUser();