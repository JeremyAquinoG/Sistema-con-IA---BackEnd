const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { analizarArchivo } = require('../controllers/ocrController');
const { extraerFormulas, extraerFormulaDesdeImagen } = require('../controllers/formulaController');

router.post('/upload', upload.single('archivo'), analizarArchivo);
router.post('/extraer-formulas', upload.single('archivo'), extraerFormulas);
router.post('/extraer-formula-img', upload.single('imagen'), extraerFormulaDesdeImagen);

module.exports = router;
