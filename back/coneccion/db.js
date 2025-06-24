const { Sequelize } = require("sequelize");

const SEQUELIZE_BD = process.env.SEQUELIZE_BD;
const SEQUELIZE_USER = process.env.SEQUELIZE_USER;
const SEQUELIZE_PASSWORD = process.env.SEQUELIZE_PASSWORD;
const SEQUELIZE_HOST = process.env.SEQUELIZE_HOST;
const SEQUELIZE_DIALECT = process.env.SEQUELIZE_DIALECT;
const SEQUELIZE_PORT = process.env.SEQUELIZE_PORT || 5432;

 const db = new Sequelize("basedatos", "root", "", {
   host: "localhost",
   dialect: "mysql",
 });

/*const db = new Sequelize(SEQUELIZE_BD, SEQUELIZE_USER, SEQUELIZE_PASSWORD, {
  host: SEQUELIZE_HOST,
  port: SEQUELIZE_PORT,
  dialect: SEQUELIZE_DIALECT,
});*/

module.exports = db;
