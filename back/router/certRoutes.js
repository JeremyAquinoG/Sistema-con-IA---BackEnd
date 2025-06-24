const express = require('express');
const controller = require('../controllers/certificadocontroller');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const Router = express.Router();

// Configurar multer para almacenar archivos en una carpeta llamada 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// 📤 Rutas públicas o sin token (si decides dejarlas así)
Router.post("/agregar", upload.single('file'), controller.agregar);
Router.get("/getall", controller.btnertoddos);
Router.get("/getfile", controller.viewfile);
Router.get("/certificado/:parametro", controller.getcertificado);

// 🔐 Rutas protegidas con autenticación
Router.post("/guardar-extraidos", authMiddleware, upload.single('file'), controller.guardarExtraidos);
Router.get("/mis-certificados", authMiddleware, controller.listarMisCertificados);

module.exports = Router;
