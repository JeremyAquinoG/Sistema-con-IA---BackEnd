const db = require("../coneccion/db");
const { DataTypes } = require("sequelize");

const Log = db.define("log", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  detalle: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = Log;
