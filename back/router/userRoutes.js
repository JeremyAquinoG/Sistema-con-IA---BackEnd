const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware'); 
const userController = require('../controllers/userController');

router.get('/perfil', verifyToken, userController.obtenerPerfil);

router.put('/actualizar', verifyToken, userController.actualizarPerfil);
router.post('/crear-perfil', verifyToken, userController.crearPerfil);


module.exports = router;
