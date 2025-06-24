const db = require("../coneccion/db");
const { DataTypes } = require("sequelize");

const certi = db.define("certificado", {
  id: {
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER
  },
  nombreCertificado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numeroCertificado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numeroProforma: {
    type: DataTypes.STRING,
    allowNull: true
  },
  razonSocial: {
    type: DataTypes.STRING,
    allowNull: true
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fechaCalibracion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lugarCalibracion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fechaEmision: {
    type: DataTypes.DATE,
    allowNull: true
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: true
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  serie: {
    type: DataTypes.STRING,
    allowNull: true
  },
  procedencia: {
    type: DataTypes.STRING,
    allowNull: true
  },
  identificacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  capacidadIndicacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resolucion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  divisionVerificacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  capacidadMinima: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numeroDivisiones: {
    type: DataTypes.STRING,
    allowNull: true
  },
  claseExactitud: {
    type: DataTypes.STRING,
    allowNull: true
  },
  metodoCalibracion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // 🚨 Campo para relacionar con el usuario
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // nombre de la tabla
      key: 'id'
    }
  }

}, {
  timestamps: false
});

module.exports = certi;
