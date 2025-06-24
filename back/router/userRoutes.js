const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

// Ruta para actualizar datos del usuario logueado
router.put('/actualizar', authMiddleware, userController.actualizarPerfil);

module.exports = router;
