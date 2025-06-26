const certi = require("../models/certificado");
const Log = require("../models/log");
const path = require('path');
const moment = require('moment-timezone');
const controller = {};

// 📥 Agregar certificado manual
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

// 📤 Guardar datos extraídos por OCR
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
      user_id: req.user.id
    });

    // ✅ Guardar log
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

// ✅ ACTUALIZAR certificado por ID
controller.actualizarCertificado = async (req, res) => {
  const id = req.params.id;
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
    const certificado = await certi.findByPk(id);

    if (!certificado) {
      return res.status(404).json({ msg: "Certificado no encontrado" });
    }

    if (certificado.user_id !== req.user.id) {
      return res.status(403).json({ msg: "No autorizado para modificar este certificado" });
    }

    await certificado.update({
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
      ...(file && { file })
    });

    await Log.create({
      user_id: req.user.id,
      accion: 'Actualización de certificado',
      detalle: `Certificado con ID ${id} fue actualizado`
    });

    return res.status(200).json({ msg: "Certificado actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar certificado:", error);
    return res.status(500).json({ msg: "Error al actualizar certificado", error: error.message });
  }
};

// 🔍 Obtener todos los certificados (público)
controller.btnertoddos = async (req, res) => {
  try {
    let datos = await certi.findAll();
    return res.send(datos);
  } catch (error) {
    return res.send({ error });
  }
};

// 🔍 Obtener certificado por parámetro
controller.getcertificado = async (req, res) => {
  try {
    const parametro = req.params.parametro;
    let datos = await certi.findOne({ where: { certificado: parametro } });
    return res.send(datos);
  } catch (error) {
    return res.send({ error });
  }
};

// 📂 Ver archivo subido
controller.viewfile = async (req, res) => {
  try {
    let name = req.query.name;
    const filePath = path.join(__dirname, '../uploads', name);
    return res.sendFile(filePath);
  } catch (error) {
    return res.send({ error });
  }
};

// 🔐 Obtener certificados propios del usuario autenticado
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
