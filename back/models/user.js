const { DataTypes } = require('sequelize');
const db = require('../coneccion/db');

const user = db.define('user', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // 👤 Datos personales
  nombres: {
    type: DataTypes.STRING,
    allowNull: true
  },
  apellidos: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo_documento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numero_documento: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // 📞 Datos de contacto
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  departamento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  provincia: {
    type: DataTypes.STRING,
    allowNull: true
  },
  distrito: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // 💼 Datos profesionales
  ocupacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ruc_empresa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = user;
