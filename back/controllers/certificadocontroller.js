const certi = require("../models/certificado");
const Log = require("../models/log"); // 👈 Asegúrate de tener este modelo creado
const path = require('path');
const moment = require('moment-timezone');
const controller = {};

// Función actual que ya funciona
controller.agregar = async (req, res) => {
  const { certificado, proforma, documento, estado, emitido, cliente } = req.body;
  const file = req.file ? req.file.filename : null;

  const emitidoUTC = moment(emitido).utc().format();

  try {
    await certi.create({
      certificado,
      proforma,
      documento,
      estado,
      emitido: emitidoUTC,
      cliente,
      file
    });
    return res.send({ msg: "Se agregó correctamente", file });
  } catch (error) {
    console.error("Error al agregar el certificado:", error);
    return res.status(500).send({ msg: "Error al agregar el certificado", error: error.message });
  }
};

// ✅ Nueva función para guardar los datos extraídos por OCR
controller.guardarExtraidos = async (req, res) => {
  const {
    nombreCertificado,
    numeroCertificado,
    numeroProforma,
    razonSocial,
    direccion,
    fechaCalibracion,
    lugarCalibracion,
    fechaEmision,
    marca,
    modelo,
    serie,
    procedencia,
    identificacion,
    ubicacion,
    capacidadIndicacion,
    resolucion,
    divisionVerificacion,
    capacidadMinima,
    numeroDivisiones,
    claseExactitud,
    metodoCalibracion
  } = req.body;

  const file = req.file ? req.file.filename : null;

  try {
    await certi.create({
      nombreCertificado,
      numeroCertificado,
      numeroProforma,
      razonSocial,
      direccion,
      fechaCalibracion,
      lugarCalibracion,
      fechaEmision,
      marca,
      modelo,
      serie,
      procedencia,
      identificacion,
      ubicacion,
      capacidadIndicacion,
      resolucion,
      divisionVerificacion,
      capacidadMinima,
      numeroDivisiones,
      claseExactitud,
      metodoCalibracion,
      file,
      user_id: req.user.id // ✅ Relacionar con el usuario autenticado
    });

    // ✅ Guardar log de acción
    await Log.create({
      user_id: req.user.id,
      accion: 'Subida de certificado',
      detalle: `Certificado ${numeroCertificado} guardado desde OCR`
    });

    return res.send({ msg: "Datos extraídos guardados correctamente", file });
  } catch (error) {
    console.error("❌ Error al guardar datos extraídos:", error);
    return res.status(500).send({ msg: "Error al guardar datos extraídos", error: error.message });
  }
};

controller.btnertoddos = async (req, res) => {
  try {
    let datos = await certi.findAll();
    return res.send(datos);
  } catch (error) {
    return res.send({ error });
  }
};

controller.getcertificado = async (req, res) => {
  try {
    const parametro = req.params.parametro;
    console.log(parametro)
    let datos = await certi.findOne({ where: { certificado: parametro } });
    return res.send(datos);
  } catch (error) {
    return res.send({ error });
  }
};

controller.viewfile = async (req, res) => {
  try {
    console.log(req.query.name);
    let name = req.query.name;
    const filePath = path.join(__dirname, '../uploads', name);
    return res.sendFile(filePath);
  } catch (error) {
    return res.send({ error });
  }
};

// ✅ Obtener certificados del usuario autenticado
controller.listarMisCertificados = async (req, res) => {
  try {
    const certificados = await certi.findAll({
      where: { user_id: req.user.id },
      order: [['fechaEmision', 'DESC']]
    });

    return res.status(200).json({ certificados });
  } catch (error) {
    console.error("❌ Error al obtener certificados:", error);
    return res.status(500).json({ message: "Error al obtener certificados", error: error.message });
  }
};

module.exports = controller;
